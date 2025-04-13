from flask import Flask, Blueprint, request, jsonify, send_from_directory, redirect
from PIL import Image
from pymongo import MongoClient
from flask_cors import CORS
import boto3
import uuid
import io, os
import numpy as np
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from google import genai
from datetime import datetime
from dotenv import load_dotenv
import tempfile
import ssl
import threading
import os
from bson import ObjectId
load_dotenv()

# --- Config ---
app = Flask(__name__, static_folder='public')
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo_client = MongoClient(app.config["MONGO_URI"])
db = mongo_client["Bitcamp2025"]
notes_collection = db["notes"]

private_key = os.getenv("HTTPS_PRIVATE_KEY_PATH")
public_key = os.getenv("HTTPS_PUBLIC_KEY_PATH")

use_https = private_key != None and public_key != None and os.path.exists(private_key) and os.path.exists(public_key)

S3_BUCKET = os.getenv("S3_BUCKET_NAME")
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

# Gemini setup
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Firebase setup
cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
firebase_admin.initialize_app(cred)

def verify_token(token):
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token["uid"]
    except Exception:
        return None

database_api_v1 = Blueprint('database_api_v1', __name__, url_prefix='/database/api/v1')
CORS(database_api_v1)

# --- Utils ---
def convert_to_jpeg(image_file):
    image = Image.open(image_file.stream).convert("RGB")
    output = io.BytesIO()
    image.save(output, format="JPEG")
    output.seek(0)

    return output

def upload_to_s3(image_bytes, filename):
    s3_key = f"notes/{filename}"
    s3_client.upload_fileobj(image_bytes, S3_BUCKET, s3_key, ExtraArgs={"ContentType": "image/jpeg"})
    return f"https://{S3_BUCKET}.s3.amazonaws.com/{s3_key}"

def run_gemini_ocr(img_bytes):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
        temp_file.write(img_bytes.read())
        temp_path = temp_file.name
        image = Image.open(temp_path)

    # Run Gemini in isolation
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                image,
                "Transcribe the text from this image into a format readable by Katex (<Latex tex='sample text'>) and give result in markdown but escape into code block so it isn't parsed by my browser"
            ]
        )
        text_output = response.candidates[0].content.parts[0].text
        return text_output
    except Exception as e:
        print("❌ Gemini OCR failed:", str(e))
        return "OCR Failed"

@database_api_v1.route('/notes/post', methods=['POST'])
def upload_notes():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization token required'}), 401
        id_token = auth_header.replace("Bearer ", "")
        user_uid = verify_token(id_token)
        if not user_uid:
            return jsonify({'error': 'Invalid token'}), 403

        post_data = request.form
        post_files = request.files

        course_name = post_data.get('course_name')
        professor_name = post_data.get('professor_name')
        image_file = post_files['image']

        if not all([user_uid, course_name, professor_name, image_file]):
            return jsonify({'error': 'Missing fields in request'}), 400

        jpeg_image = convert_to_jpeg(image_file)
        jpeg_bytes = jpeg_image.read()  # Read the image once as bytes

        # Upload to S3
        image_id = str(uuid.uuid4())
        filename = f"{user_uid}_{image_id}.jpg"
        s3_url = upload_to_s3(io.BytesIO(jpeg_bytes), filename)

        # Run OCR on fresh stream
        ocr_result = run_gemini_ocr(io.BytesIO(jpeg_bytes))


        now = datetime.utcnow()

        notes_collection.insert_one({
            "user_uid": user_uid,
            "course_name": course_name,
            "professor_name": professor_name,
            "image_id": image_id,
            "s3_url": s3_url,
            "ocr_markdown": ocr_result,
            "uploaded_at": now
        })

        return jsonify({
            "message": "Note uploaded and processed.",
            "image_id": image_id,
            "s3_url": s3_url,
            "ocr_markdown": ocr_result
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@database_api_v1.route('/notes/get', methods=['GET'])
def get_notes():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization token required'}), 401
        id_token = auth_header.replace("Bearer ", "")
        user_uid = verify_token(id_token)
        if not user_uid:
            return jsonify({'error': 'Invalid token'}), 403
        course_name = request.args.get('course_name')
        sort_order = request.args.get('sort', 'desc')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))

        query = {}
        if user_uid:
            query["user_uid"] = user_uid
        if course_name:
            query["course_name"] = course_name

        sort_dir = -1 if sort_order == "desc" else 1
        cursor = notes_collection.find(query).sort("uploaded_at", sort_dir).skip((page - 1) * per_page).limit(per_page)

        notes = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            notes.append({
                "user_uid": doc["user_uid"],
                "course_name": doc["course_name"],
                "professor_name": doc.get("professor_name", ""),
                "image_id": doc["image_id"],
                "s3_url": doc["s3_url"],
                "ocr_markdown": doc.get("ocr_markdown", ""),
                "uploaded_at": doc["uploaded_at"].isoformat()
            })

        return jsonify({
            "notes": notes,
            "page": page,
            "per_page": per_page,
            "filters": {"user_uid": user_uid, "course_name": course_name},
            "sort": sort_order
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@database_api_v1.route('/notes/delete', methods=['DELETE'])
def delete_note():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization token required'}), 401

        id_token = auth_header.replace("Bearer ", "")
        user_uid = verify_token(id_token)
        if not user_uid:
            return jsonify({'error': 'Invalid token'}), 403

        note_id = request.args.get('note_id')
        if not note_id:
            return jsonify({'error': 'Missing note_id'}), 400

        result = notes_collection.delete_one({
            "_id": ObjectId(note_id),
            "user_uid": user_uid
        })

        if result.deleted_count == 0:
            return jsonify({'error': 'Note not found or not authorized'}), 404

        return jsonify({'message': 'Note deleted successfully'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@database_api_v1.route('/notes/mine', methods=['GET'])
def get_my_notes():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization token required'}), 401

        id_token = auth_header.replace("Bearer ", "")
        user_uid = verify_token(id_token)
        if not user_uid:
            return jsonify({'error': 'Invalid token'}), 403

        course_name = request.args.get('course_name')
        professor_name = request.args.get('professor_name')
        sort_order = request.args.get('sort', 'desc')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))

        query = {"user_uid": user_uid}
        if course_name:
            query["course_name"] = course_name
        if professor_name:
            query["professor_name"] = professor_name

        sort_dir = -1 if sort_order == "desc" else 1
        cursor = notes_collection.find(query).sort("uploaded_at", sort_dir).skip((page - 1) * per_page).limit(per_page)

        notes = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            notes.append({
                "note_id": str(doc["_id"]),
                "user_uid": doc["user_uid"],
                "course_name": doc["course_name"],
                "professor_name": doc.get("professor_name", ""),
                "image_id": doc["image_id"],
                "s3_url": doc["s3_url"],
                "ocr_markdown": doc.get("ocr_markdown", ""),
                "uploaded_at": doc["uploaded_at"].isoformat()
            })

        return jsonify({
            "notes": notes,
            "page": page,
            "per_page": per_page,
            "filters": {"course_name": course_name, "professor_name": professor_name},
            "sort": sort_order
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Register blueprint
app.register_blueprint(database_api_v1)

# Serve index.html on root
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Serve other static files, handle extension-less routes
@app.route('/<path:path>')
def static_files(path):
    file_path = os.path.join(app.static_folder, path)

    # If it's a file that exists, serve it
    if os.path.isfile(file_path):
        return send_from_directory(app.static_folder, path)

    # If it's a directory with index.html
    if os.path.isdir(file_path) and os.path.isfile(os.path.join(file_path, 'index.html')):
        return send_from_directory(file_path, 'index.html')

    # Try adding .html
    if os.path.isfile(file_path + '.html'):
        return send_from_directory(app.static_folder, path + '.html')

    # Otherwise serve custom 404 page if it exists
    if os.path.isfile(os.path.join(app.static_folder, '404.html')):
        return send_from_directory(app.static_folder, '404.html'), 404

    # Fallback if 404.html isn't found
    return "404 Not Found", 404


# HTTP to HTTPS redirect
http_redirect = Flask('redirect')

if use_https:
    @http_redirect.route('/', defaults={'path': ''})
    @http_redirect.route('/<path:path>')
    def redirect_to_https(path):
        return redirect(f'https://{request.host}{request.full_path}', code=301)

    def run_https():
        context = ('/etc/ssl/web/terpnotes_tech.crt', '/etc/ssl/web/terpnotes_tech_private.key')
        app.run(host='0.0.0.0', port=443, ssl_context=context)

def run_http():
    http_redirect.run(host='0.0.0.0', port=80)

if __name__ == '__main__':
    if use_https:
        print("✅ HTTPS enabled. Starting HTTPS and HTTP redirect servers...")

        def run_https():
            context = (public_key, private_key)
            app.run(host='0.0.0.0', port=443, ssl_context=context)

        def run_http_redirect():
            http_redirect.run(host='0.0.0.0', port=80)

        threading.Thread(target=run_https).start()
        threading.Thread(target=run_http_redirect).start()

    else:
        print(f"⚠️ HTTPS disabled. Running server over HTTP only on port 80.")
        app.run(host='0.0.0.0', port=80)
