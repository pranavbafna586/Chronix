// diseases.ts
export interface Disease {
  id: string;
  name: string;
  description: string;
  questions: {
    text: string;
    type: 'radio' | 'number';
    options?: string[];
    unit?: string;
    tooltip?: string;
    followUp?: {
      text: string;
      type: 'number';
      unit?: string;
      tooltip?: string;
    };
  }[];
}

export const diseases: Disease[] = [
  {
    id: "diabetes",
    name: "Diabetes",
    description: "A chronic condition affecting how your body processes blood sugar.",
    questions: [
      {
        text: "Gender",
        type: "radio",
        options: ["Male", "Female"]
      },
      {
        text: "Age",
        type: "number",
        unit: "years"
      },
      {
        text: "Do you have Hypertension?",
        type: "radio",
        options: ["Yes", "No"]
      },
      {
        text: "Do you have Heart Disease?",
        type: "radio",
        options: ["Yes", "No"]
      },
      {
        text: "Height",
        type: "number",
        unit: "cm",
        tooltip: "Enter your height in centimeters"
      },
      {
        text: "Weight",
        type: "number",
        unit: "kg",
        tooltip: "Enter your weight in kilograms"
      },
      {
        text: "HbA1c Level",
        type: "number",
        unit: "%",
        tooltip: "HbA1c is a measure of blood sugar levels over the past 3 months"
      },
      {
        text: "Blood Glucose Level",
        type: "number",
        unit: "mg/dL",
        tooltip: "Enter your current fasting blood glucose level"
      },
      {
        text: "Smoking Habit",
        type: "radio",
        options: ["Yes", "No"]
      }
    ]
  },
  {
    id: "hypertension",
    name: "Hypertension",
    description: "High blood pressure that can lead to serious health problems.",
    questions: [
      {
        text: "Gender",
        type: "radio",
        options: ["Male", "Female"]
      },
      {
        text: "Age",
        type: "number",
        unit: "years"
      },
      {
        text: "Do you smoke?",
        type: "radio",
        options: ["Yes", "No"],
        followUp: {
          text: "Number of cigarettes smoked per day",
          type: "number",
          unit: "count",
          tooltip: "Approximate number of cigarettes you smoke daily"
        }
      },
      {
        text: "Do you use Blood Pressure Medicine?",
        type: "radio",
        options: ["Yes", "No"]
      },
      {
        text: "Total Cholesterol Level",
        type: "number",
        unit: "mg/dL",
        tooltip: "Enter your latest total cholesterol reading"
      },
      {
        text: "Systolic Blood Pressure",
        type: "number",
        unit: "mmHg",
        tooltip: "Enter the higher number of your blood pressure reading"
      },
      {
        text: "Diastolic Blood Pressure",
        type: "number",
        unit: "mmHg",
        tooltip: "Enter the lower number of your blood pressure reading"
      },
      {
        text: "Height",
        type: "number",
        unit: "cm",
        tooltip: "Enter your height in centimeters"
      },
      {
        text: "Weight",
        type: "number",
        unit: "kg",
        tooltip: "Enter your weight in kilograms"
      },
      {
        text: "Heart Rate",
        type: "number",
        unit: "bpm",
        tooltip: "Enter your resting heart rate in beats per minute"
      },
      {
        text: "Glucose Level",
        type: "number",
        unit: "mg/dL",
        tooltip: "Enter your current fasting blood glucose level"
      }
    ]
  },
  {
    id: "heart",
    name: "Heart Disease",
    description: "Conditions affecting your heart's structure and function.",
    questions: [
      {
        text: "Age",
        type: "number",
        unit: "years"
      },
      {
        text: "Gender",
        type: "radio",
        options: ["Male", "Female"]
      },
      {
        text: "Systolic Blood Pressure",
        type: "number",
        unit: "mmHg",
        tooltip: "Enter the higher number of your blood pressure reading"
      },
      {
        text: "Diastolic Blood Pressure",
        type: "number",
        unit: "mmHg",
        tooltip: "Enter the lower number of your blood pressure reading"
      },
      {
        text: "Total Cholesterol Level",
        type: "number",
        unit: "mg/dL",
        tooltip: "Enter your latest total cholesterol reading"
      },
      {
        text: "Glucose Level",
        type: "number",
        unit: "mg/dL",
        tooltip: "Enter your current fasting blood glucose level"
      },
      {
        text: "Smoking Habit",
        type: "radio",
        options: ["Yes", "No"]
      },
      {
        text: "Do you consume Alcohol?",
        type: "radio",
        options: ["Yes", "No"]
      },
      {
        text: "Are you Physically Active?",
        type: "radio",
        options: ["Yes", "No"],
        tooltip: "Engaging in moderate exercise at least 3 times a week"
      },
      {
        text: "Height",
        type: "number",
        unit: "cm",
        tooltip: "Enter your height in centimeters"
      },
      {
        text: "Weight",
        type: "number",
        unit: "kg",
        tooltip: "Enter your weight in kilograms"
      }
    ]
  }
];