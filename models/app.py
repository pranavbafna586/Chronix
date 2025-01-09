from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import io
import mimetypes
import os
import pandas as pd
import joblib
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY1')

genai.configure(api_key=GEMINI_API_KEY)

# Load models
diabetes_model = joblib.load('diabetes.pkl')
heart_model = joblib.load('heart.pkl')
hypertension_model = joblib.load('hypertension.pkl')


@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    data = request.get_json()
    # print(data)
    height = float(data['height'])
    weight = float(data['weight'])
    bmi = round((weight / (height / 100) ** 2), 2)

    formatted_data = {
        'gender': 1 if data['gender'] == 'Male' else 0,
        'age': float(data['age']),
        'hypertension': 1 if data['do_you_have_hypertension?'] == 'Yes' else 0,
        'heart_disease': 1 if data['do_you_have_heart_disease?'] == 'Yes' else 0,
        'bmi': bmi,
        'HbA1c_level': float(data['hba1c_level']),
        'blood_glucose_level': float(data['blood_glucose_level']),
        'smoking_history': 1 if data['smoking_habit'] == 'Yes' else 0
    }

    df = pd.DataFrame(formatted_data, index=[0])
    prediction = diabetes_model.predict_proba(df)
    print(prediction)
    return jsonify({'prediction': prediction.tolist()})

@app.route('/predict/heart', methods=['POST'])
def predict_heart():
    data = request.get_json()
    height = float(data['height'])
    weight = float(data['weight'])
    bmi = round((weight / (height / 100) ** 2), 1)

    cholesterol = 1 if float(data['total_cholesterol_level']) < 200 else 2 if float(data['total_cholesterol_level']) <= 240 else 3
    glucose = 1 if float(data['glucose_level']) < 100 else 2 if float(data['glucose_level']) <= 125 else 3

    formatted_data = {
        'age': float(data['age']),
        'gender': 1 if data['gender'] == 'Male' else 0,
        'ap_hi': float(data['systolic_blood_pressure']),
        'ap_lo': float(data['diastolic_blood_pressure']),
        'cholesterol': cholesterol,
        'gluc': glucose,
        'smoke': 1 if data['smoking_habit'] == 'Yes' else 0,
        'alco': 1 if data['do_you_consume_alcohol?'] == 'Yes' else 0,
        'active': 1 if data['are_you_physically_active?'] == 'Yes' else 0,
        'bmi': bmi
    }

    print(formatted_data)

    df = pd.DataFrame(formatted_data, index=[0])
    prediction = heart_model.predict_proba(df)
    print(prediction)
    return jsonify({'prediction': prediction.tolist()})

@app.route('/predict/hypertension', methods=['POST'])
def predict_hypertension():
    data = request.get_json()
    height = float(data['height'])
    weight = float(data['weight'])
    bmi = round((weight / (height / 100) ** 2), 2)

    formatted_data = {
        'male': 1 if data['gender'] == 'Male' else 0,
        'age': float(data['age']),
        'currentSmoker': 1 if data['do_you_smoke?'] == 'Yes' else 0,
        'cigsPerDay': int(data['number_of_cigarettes_smoked_per_day']) if data['do_you_smoke?'] == 'Yes' else 0,
        'BPMeds': 1 if data['do_you_use_blood_pressure_medicine?'] == 'Yes' else 0,
        'totChol': float(data['total_cholesterol_level']),
        'sysBP': float(data['systolic_blood_pressure']),
        'diaBP': float(data['diastolic_blood_pressure']),
        'BMI': bmi,
        'heartRate': float(data['heart_rate']),
        'glucose': float(data['glucose_level'])
    }

    df = pd.DataFrame(formatted_data, index=[0])
    prediction = hypertension_model.predict_proba(df)
    print(prediction)
    return jsonify({'prediction': prediction.tolist()})




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

        Return the extracted details in english language only.
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
