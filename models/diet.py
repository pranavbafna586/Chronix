from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY1')

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro")

def create_prompt(form_data):
    return f"""Generate a detailed diet plan based on the following preferences:
    Activity Level: {form_data['activityLevel']}
    Dietary Preferences: {', '.join(form_data['dietaryPreferences'])}
    Allergies: {form_data['allergies']}
    Foods to Avoid: {form_data['avoidFoods']}
    Health Goal: {form_data['healthGoal']}
    Plan Duration: {form_data['planDuration']} days
    Weekly Budget: ₹{form_data['budget']}

    Generate 3 different diet plans. Each plan should include:
    1. Plan name
    2. Daily calorie target
    3. Macronutrient split (protein, carbs, fat percentages)
    4. Weekly cost
    5. Daily meals (breakfast, lunch, dinner, snacks) for {form_data['planDuration']} days

    Format the response as a JSON array with exactly this structure for each plan:
    {{
        "id": number,
        "name": string,
        "calories": number,
        "macros": {{ "protein": number, "carbs": number, "fat": number }},
        "cost": number,
        "meals": [
            {{
                "day": number,
                "breakfast": string,
                "lunch": string,
                "dinner": string,
                "snacks": [string]
            }}
        ]
    }}"""

def validate_and_fix_plan(plan):
    """Ensures the plan matches the expected format and fixes common issues"""
    required_fields = {'id', 'name', 'calories', 'macros', 'cost', 'meals'}
    macro_fields = {'protein', 'carbs', 'fat'}
    meal_fields = {'day', 'breakfast', 'lunch', 'dinner', 'snacks'}

    # Add missing fields with default values
    for field in required_fields:
        if field not in plan:
            plan[field] = [] if field == 'meals' else ''

    if 'macros' in plan:
        for field in macro_fields:
            if field not in plan['macros']:
                plan['macros'][field] = 33

    # Ensure meals array contains all required fields
    if 'meals' in plan:
        for meal in plan['meals']:
            for field in meal_fields:
                if field not in meal:
                    meal[field] = [] if field == 'snacks' else ''
            if not isinstance(meal['snacks'], list):
                meal['snacks'] = [meal['snacks']] if meal['snacks'] else []

    return plan

@app.route('https://dietflask.onrender.com/generate-plan', methods=['POST'])
def generate_plan():
    try:
        form_data = request.json
        prompt = create_prompt(form_data)
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        
        # Extract JSON from response
        response_text = response.text
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

if __name__ == '__main__':
    app.run(debug=True)