from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import io
import mimetypes
import os

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY1')

genai.configure(api_key=GEMINI_API_KEY)

@app.route('/upload', methods=['POST'])
def process_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    
    try:
        # Create a BytesIO object from the file data
        file_data = io.BytesIO(audio_file.read())
        file_data.name = audio_file.filename
        
        mime_type = audio_file.content_type or mimetypes.guess_type(audio_file.filename)[0]
        if not mime_type:
            mime_type = 'audio/wav'
        
        medicine_data = extract_medicine_data(file_data, mime_type)
        return medicine_data
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def extract_medicine_data(file_data, mime_type):
    """
    Process the audio file using the Gemini model to extract medicine names and timings.

    Args:
        file_data: BytesIO object containing the audio file data.
        mime_type: String specifying the MIME type of the audio file.

    Returns:
        dict: Extracted medicine details formatted as JSON.
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        myfile = genai.upload_file(file_data, mime_type=mime_type)

        prompt = """
        Analyze the provided audio file for transcription and extract the following details:
        - Hospital name
        - Hospital logo
        - Doctor's name
        - Patient's name
        - Date
        
        Additionally, extract the medicines and their details in the following table format:
        - col-0: Sr. No.
        - col-1: Medicine Name
        - col-2: Dosage Time (Options: Morning, Afternoon, Evening, or Pair)
        - col-3: Instruction (Default to "Take as needed for pain" if no specific instruction is provided)

        Provide the output in the following JSON format:
        {
            "hospital_name": "Example Hospital",
            "hospital_logo": "URL or base64 string",
            "doctor_name": "Dr. Example",
            "patient_name": "John Doe",
            "date": "YYYY-MM-DD",
            "medicine_table": [
                {"Sr.No": 1, "Medicine Name": "Medicine1", "Dosage Time": "Morning", "Instruction": "Take after food"},
                {"Sr.No": 2, "Medicine Name": "Medicine2", "Dosage Time": "Afternoon", "Instruction": "Take as needed for pain"},
                {"Sr.No": 3, "Medicine Name": "Medicine3", "Dosage Time": "Evening", "Instruction": "Take after food"}
            ]
        }
        """

        result = model.generate_content([myfile, prompt])

        if result and hasattr(result, 'text'):
            transcription = result.text.strip()
            return {"data": transcription}

        return {"error": "No valid transcription found"}

    except Exception as e:
        raise RuntimeError(f"Error processing audio with Gemini model: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True)
