export interface Disease {
  id: string
  name: string
  description: string
  questions: {
    text: string
    type: 'slider' | 'toggle'
    followUp?: string
  }[]
  parameters: {
    id: string
    label: string
    average: string
    helper?: string
  }[]
}

export const diseases: Disease[] = [
  {
    id: "diabetes",
    name: "Diabetes",
    description: "A chronic condition affecting how your body processes blood sugar.",
    questions: [
      {
        text: "How frequently do you feel excessively thirsty?",
        type: "slider"
      },
      {
        text: "Have you noticed frequent urination?",
        type: "toggle",
        followUp: "Is it disrupting your sleep?"
      },
      {
        text: "Do you feel fatigued without reason?",
        type: "toggle"
      },
      {
        text: "Have you experienced unexplained weight loss?",
        type: "toggle"
      },
      {
        text: "Do you have blurred vision occasionally?",
        type: "toggle"
      }
    ],
    parameters: [
      {
        id: "fasting-glucose",
        label: "Fasting Blood Sugar Level",
        average: "80–100 mg/dL",
        helper: "Measure after 8 hours of fasting"
      },
      {
        id: "hba1c",
        label: "HbA1c Percentage",
        average: "4.0–5.6%",
        helper: "Average blood sugar level over past 2-3 months"
      }
    ]
  },
  {
    id: "hypertension",
    name: "Hypertension",
    description: "High blood pressure that can lead to serious health problems.",
    questions: [
      {
        text: "Do you experience frequent headaches or dizziness?",
        type: "toggle"
      },
      {
        text: "Have you felt chest pain or tightness recently?",
        type: "toggle"
      },
      {
        text: "Do you exercise regularly?",
        type: "toggle"
      },
      {
        text: "Do you have a family history of high blood pressure?",
        type: "toggle"
      },
      {
        text: "Do you consume a high-salt diet?",
        type: "toggle"
      }
    ],
    parameters: [
      {
        id: "systolic",
        label: "Systolic Blood Pressure",
        average: "120 mmHg",
        helper: "The top number in blood pressure reading"
      },
      {
        id: "diastolic",
        label: "Diastolic Blood Pressure",
        average: "80 mmHg",
        helper: "The bottom number in blood pressure reading"
      }
    ]
  },
  {
    id: "thyroid",
    name: "Thyroid",
    description: "A condition affecting the thyroid gland and hormone production.",
    questions: [
      {
        text: "Have you experienced unexplained weight changes?",
        type: "toggle"
      },
      {
        text: "Do you often feel unusually tired or sluggish?",
        type: "toggle"
      },
      {
        text: "Do you have dry skin or hair loss?",
        type: "toggle"
      },
      {
        text: "Do you feel cold when others feel warm?",
        type: "toggle"
      },
      {
        text: "Have you noticed changes in your heart rate?",
        type: "toggle"
      }
    ],
    parameters: [
      {
        id: "tsh",
        label: "TSH Level",
        average: "0.4–4.0 mIU/L",
        helper: "Thyroid Stimulating Hormone level"
      },
      {
        id: "t4",
        label: "Free T4 Level",
        average: "0.8–1.8 ng/dL",
        helper: "Thyroxine hormone level"
      }
    ]
  },
  {
    id: "anemia",
    name: "Anemia",
    description: "A condition where you lack enough healthy red blood cells.",
    questions: [
      {
        text: "Do you feel short of breath even with light activity?",
        type: "toggle"
      },
      {
        text: "Have you noticed unusual paleness or cold hands/feet?",
        type: "toggle"
      },
      {
        text: "Do you often feel dizzy or lightheaded?",
        type: "toggle"
      },
      {
        text: "Do you feel unusually tired or weak?",
        type: "toggle"
      },
      {
        text: "Do you have frequent headaches?",
        type: "toggle"
      }
    ],
    parameters: [
      {
        id: "hemoglobin",
        label: "Hemoglobin Level",
        average: "12–16 g/dL",
        helper: "Protein in red blood cells that carries oxygen"
      },
      {
        id: "ferritin",
        label: "Ferritin Level",
        average: "30–400 ng/mL",
        helper: "Protein that stores iron"
      }
    ]
  },
  {
    id: "copd",
    name: "COPD",
    description: "A chronic inflammatory lung disease causing airflow blockage.",
    questions: [
      {
        text: "Do you experience shortness of breath regularly?",
        type: "toggle"
      },
      {
        text: "Have you noticed persistent coughing with mucus?",
        type: "toggle"
      },
      {
        text: "Are you exposed to smoke or pollutants often?",
        type: "toggle"
      },
      {
        text: "Do you have trouble sleeping due to breathing issues?",
        type: "toggle"
      },
      {
        text: "Do you get frequent respiratory infections?",
        type: "toggle"
      }
    ],
    parameters: [
      {
        id: "fev1",
        label: "FEV1",
        average: ">80%",
        helper: "Forced expiratory volume in 1 second"
      },
      {
        id: "oxygen",
        label: "Oxygen Saturation",
        average: "95–100%",
        helper: "Amount of oxygen in your blood"
      }
    ]
  },
  {
    id: "heart",
    name: "Heart Disease",
    description: "Conditions affecting your heart's structure and function.",
    questions: [
      {
        text: "Do you often experience chest pain or tightness?",
        type: "toggle"
      },
      {
        text: "Have you been diagnosed with high cholesterol?",
        type: "toggle"
      },
      {
        text: "Do you feel short of breath even at rest?",
        type: "toggle"
      },
      {
        text: "Do you have swelling in your legs or ankles?",
        type: "toggle"
      },
      {
        text: "Do you experience irregular heartbeats?",
        type: "toggle"
      }
    ],
    parameters: [
      {
        id: "ldl",
        label: "LDL Cholesterol",
        average: "<100 mg/dL",
        helper: "Low-density lipoprotein cholesterol level"
      },
      {
        id: "heart-rate",
        label: "Resting Heart Rate",
        average: "60–100 bpm",
        helper: "Number of heart beats per minute at rest"
      }
    ]
  },
  {
    id: "kidney",
    name: "Kidney Disease",
    description: "Conditions affecting your kidneys' ability to filter blood.",
    questions: [
      {
        text: "Do you experience swelling in your hands or feet?",
        type: "toggle"
      },
      {
        text: "Have you noticed foamy or dark urine?",
        type: "toggle"
      },
      {
        text: "Do you feel fatigued or have trouble concentrating?",
        type: "toggle"
      },
      {
        text: "Do you have high blood pressure?",
        type: "toggle"
      },
      {
        text: "Do you have diabetes?",
        type: "toggle"
      }
    ],
    parameters: [
      {
        id: "creatinine",
        label: "Serum Creatinine",
        average: "0.7–1.3 mg/dL",
        helper: "Waste product filtered by kidneys"
      },
      {
        id: "gfr",
        label: "GFR",
        average: ">90 mL/min/1.73 m²",
        helper: "Glomerular Filtration Rate - kidney function measure"
      }
    ]
  }
]

