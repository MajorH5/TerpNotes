from flask import Flask, Blueprint, request, jsonify
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
import tempfile

# --- Config ---
app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo_client = MongoClient(app.config["MONGO_URI"])
db = mongo_client["Bitcamp2025"]
notes_collection = db["notes"]


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
        image =  Image.open(temp_path)
        response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[image, "Transcribe the text from this image into a format readable by Katex (<Latex tex='sample text'>) and give result in markdown but escape into code block so it isn't parsed by my browser"]
        )
        text_output = response.candidates[0].content.parts[0].text
        return text_output

# --- Routes ---
@app.route('/')
def hello():
    return 'Hello, World! <a href="/database/api/v1/notes/get">Go to API</a>'

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

        user_id = post_data.get('user_id')
        course_name = post_data.get('course_name')
        professor_name = post_data.get('professor_name')
        image_file = post_files['image']

        if not all([user_id, course_name, professor_name, image_file]):
            return jsonify({'error': 'Missing fields in request'}), 400

        jpeg_image = convert_to_jpeg(image_file)
        image_id = str(uuid.uuid4())
        filename = f"{user_id}_{image_id}.jpg"
        s3_url = upload_to_s3(jpeg_image, filename)

        jpeg_image.seek(0)
        ocr_result = run_gemini_ocr(jpeg_image)

        now = datetime.utcnow()

        notes_collection.insert_one({
            "user_id": user_id,
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
        user_id = request.args.get('user_id')
        course_name = request.args.get('course_name')
        sort_order = request.args.get('sort', 'desc')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))

        query = {}
        if user_id:
            query["user_id"] = user_id
        if course_name:
            query["course_name"] = course_name

        sort_dir = -1 if sort_order == "desc" else 1
        cursor = notes_collection.find(query).sort("uploaded_at", sort_dir).skip((page - 1) * per_page).limit(per_page)

        notes = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            notes.append({
                "user_id": doc["user_id"],
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
            "filters": {"user_id": user_id, "course_name": course_name},
            "sort": sort_order
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Register blueprint
app.register_blueprint(database_api_v1)

if __name__ == '__main__':
    app.run(debug=True)
