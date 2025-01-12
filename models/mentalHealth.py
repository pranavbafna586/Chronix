import numpy as np
from sklearn.preprocessing import LabelEncoder
import speech_recognition as sr


# Define the order of columns as used in training
columns_order = ['gender', 'Occupation', 'Mood_Swings', 'Changes_Habits', 'Work_Interest', 'Social_Weakness']

# Function to encode input for mental health prediction
def encode_input(user_input):
    encoded_input = []
    for column in columns_order:
        le = LabelEncoder()
        le.fit(['Male', 'Female'] if column == 'gender' else
               ['Corporate', 'Student', 'Business', 'Housewife', 'Others'] if column == 'Occupation' else
               ['Medium', 'Low', 'High'] if column == 'Mood_Swings' else
               ['No', 'Yes', 'Maybe'])  # Adjust categories as per each column
        encoded_input.append(le.transform([user_input[column]])[0])
    return np.array(encoded_input).reshape(1, -1)

# Function to record audio
def record_audio():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Speak now...")
        audio = recognizer.listen(source)
    return audio

# Function to convert speech to text
def convert_speech_to_text(audio):
    recognizer = sr.Recognizer()
    try:
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        return "Speech not understood"
    except sr.RequestError:
        return "Error in speech recognition service"

# Function to analyze voice using Gemini
# def analyze_voice(text):
#     model = genai.GenerativeModel('gemini-1.5-pro')
#     prompt_template = f"""
#     Analyze the following speech text and provide a voice analysis in JSON format.
#     Text: "{text}"
    
#     Provide the analysis in exactly this JSON format:
#     {{
#         "Smoothness": "<percentage out of 100> %",
#         "Control": "<percentage out of 100> %",
#         "Liveliness": "<number between 0-1 with 2 decimal places>",
#         "Energy_range": "<number> dB",
#         "Clarity": "<number> ms",
#         "Crispness": "<number between 0-1 with 2 decimal places>",
#         "Speech": "<Normal/Emotional/Monotone>",
#         "Pause": "<Regular/Fluent/Filled Pauses>"
#     }}
    
#     Ensure the values are within the specified ranges and units.
#     """

#     response = model.generate_content(prompt_template)
#     try:
#         json_str = response.text.strip()
#         if '```json' in json_str:
#             json_str = json_str.split('```json')[1].split('```')[0].strip()
#         return json.loads(json_str)
#     except json.JSONDecodeError:
#         return {"error": "Failed to parse JSON response"}

# Route for voice analysis
# @app.route('/voice_analysis', methods=['POST'])


