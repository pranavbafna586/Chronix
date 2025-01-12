from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import io
import mimetypes
import os
import base64
import pandas as pd
import joblib
import json
from dotenv import load_dotenv

import warnings
warnings.filterwarnings("ignore")

from diet import create_prompt, validate_and_fix_plan 
from prescription import extract_medicine_data
from mentalHealth import encode_input

load_dotenv()

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY1')

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro")

# Load models
diabetes_model = joblib.load('diabetes.pkl')
heart_model = joblib.load('heart.pkl')
hypertension_model = joblib.load('hypertension.pkl')
mental_health_model = joblib.load('mental_health_model.pkl')


#######################################################################################################################
# Diabetes prediction route
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

# Heart disease prediction route
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

# Hypertension prediction route
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


#######################################################################################################################
# Diet plan generation route
@app.route('/generate-plan', methods=['POST'])
def generate_plan():
    try:
        form_data = request.json
        prompt = create_prompt(form_data)
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        
        # Extract JSON from response
        response_text = response.text
        print(response_text)
        # Find the JSON array in the response
        start_idx = response_text.find('[')
        end_idx = response_text.rfind(']') + 1
        if start_idx == -1 or end_idx == 0:
            raise ValueError("No valid JSON array found in response")
            
        json_str = response_text[start_idx:end_idx]
        plans = json.loads(json_str)
        
        # Validate and fix each plan
        validated_plans = [validate_and_fix_plan(plan) for plan in plans]
        
        return jsonify(validated_plans)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


#######################################################################################################################
# Audio processing route
@app.route('/prescription/upload', methods=['POST'])
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

#######################################################################################################################
# Route for mental health prediction
@app.route('/mental/predict', methods=['POST'])
def predict():
    user_input = request.json  # Expecting JSON input
    X_test = encode_input(user_input)
    probabilities = mental_health_model.predict_proba(X_test)
    prob_yes = probabilities[0][1]
    return jsonify({"mental_fitness_score": int(round(prob_yes * 100))})

# Route for voice analysis of mental health
@app.route('/mental/voice_analysis', methods=['POST'])
def voice_analysis():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    
    try:
        # Read the audio file data
        audio_data = audio_file.read()
        
        # Convert to base64 for Gemini
        file_data = {
            "mime_type": "audio/webm",  # Update this based on the actual mime type
            "data": base64.b64encode(audio_data).decode('utf-8')
        }

        # Perform voice analysis using Gemini
        prompt_template = """
        Analyze the following audio file and provide a voice analysis in JSON format.
        
        Provide the analysis in exactly this JSON format:
        {
            "Smoothness": "<percentage out of 100> %",
            "Control": "<percentage out of 100> %",
            "Liveliness": "<number between 0-1 with 2 decimal places>",
            "Energy_range": "<number> dB",
            "Clarity": "<number> ms",
            "Crispness": "<number between 0-1 with 2 decimal places>",
            "Speech": "<Normal/Emotional/Monotone>",
            "Pause": "<Regular/Fluent/Filled Pauses>"
        }
        """

        response = model.generate_content([file_data, prompt_template])
        json_str = response.text.strip()
        if '```json' in json_str:
            json_str = json_str.split('```json')[1].split('```')[0].strip()
        analysis = json.loads(json_str)
    except json.JSONDecodeError:
        analysis = {"error": "Failed to parse JSON response"}
    except Exception as e:
        analysis = {"error": f"An error occurred: {str(e)}"}

    return jsonify({"voice_analysis": analysis})

#######################################################################################################################
if __name__ == '__main__':
    app.run(debug=True)
