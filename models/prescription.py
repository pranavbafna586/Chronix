import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

model = genai.GenerativeModel("gemini-1.5-pro")

def extract_medicine_data(file_data, mime_type):
    """
    Process the audio file using the Gemini model to extract medicine names, timings, and duration.

    Args:
        file_data: BytesIO object containing the audio file data.
        mime_type: String specifying the MIME type of the audio file.

    Returns:
        dict: Extracted medicine details formatted as JSON.
    """
    try:
        
        myfile = genai.upload_file(file_data, mime_type=mime_type)

        prompt = """
        Analyze the provided audio file for transcription and extract the following details:
        - Hospital name is always going to be "Namo Hospital" so don't change it.
        - Hospital logo
        - Doctor's name is always going to be "Dr. Pranav Bafna" so don't change it.
        - Patient's name (if not available, default to "Patient")
        - Date is always going to be today's date.
        - Prescription Duration (in days)
        
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
            "prescription_duration": "7 days",
            "medicine_table": [
                {"Sr.No": 1, "Medicine Name": "Medicine1", "Dosage Time": "Morning", "Instruction": "Take after food"},
                {"Sr.No": 2, "Medicine Name": "Medicine2", "Dosage Time": "Afternoon", "Instruction": "Take as needed for pain"},
                {"Sr.No": 3, "Medicine Name": "Medicine3", "Dosage Time": "Evening", "Instruction": "Take after food"}
            ]
        }

        Return the extracted details in english language only. The prescription duration should be extracted from the audio if mentioned, otherwise default to 7 days.
        """

        result = model.generate_content([myfile, prompt])

        if result and hasattr(result, 'text'):
            transcription = result.text.strip()
            return {"data": transcription}

        return {"error": "No valid transcription found"}

    except Exception as e:
        raise RuntimeError(f"Error processing audio with Gemini model: {str(e)}")
