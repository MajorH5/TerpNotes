import os
import io
from PIL import Image
from google import genai
from dotenv import load_dotenv
import tempfile


load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
# --- Setup ---

# --- Function ---
def prompt_gemini_with_image(image_path, prompt_text):
    with Image.open(image_path).convert("RGB") as img:
        img_bytes = io.BytesIO()
        img.save(img_bytes, format="JPEG")
        img_bytes.seek(0)
        print(img_bytes)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(img_bytes.read())
            temp_path = temp_file.name
            image =  Image.open(temp_path)
            response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[image, prompt_text]
        )
        return response
        
# --- Example usage ---
prompt = "Transcribe the text from this image and give result in markdown but escape into code block so it isn't parsed by my browser"
image_path = "test-note.png"  # replace with your path
markdown_result = prompt_gemini_with_image(image_path, prompt)
text_output = markdown_result.candidates[0].content.parts[0].text
print(text_output)
