"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Question from "@/components/ai-risk-content/question";

type QuestionType = "number" | "boolean" | "select";

interface QuestionData {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // Only required if type is "select"
}

const questions: QuestionData[] = [
  { id: "age", text: "What is your age?", type: "number" },
  {
    id: "gender",
    text: "What is your gender?",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
  { id: "weight", text: "What is your weight in kg?", type: "number" },
  { id: "height", text: "What is your height in cm?", type: "number" },
  { id: "smoking", text: "Do you smoke?", type: "boolean" },
  { id: "alcohol", text: "Do you consume alcohol regularly?", type: "boolean" },
  {
    id: "exercise",
    text: "How often do you exercise per week?",
    type: "select",
    options: ["Never", "1-2 times", "3-4 times", "5+ times"],
  },
  {
    id: "diet",
    text: "How would you describe your diet?",
    type: "select",
    options: ["Poor", "Average", "Good", "Excellent"],
  },
  {
    id: "familyHistory",
    text: "Do you have a family history of any chronic diseases?",
    type: "boolean",
  },
  {
    id: "stress",
    text: "How would you rate your stress level?",
    type: "select",
    options: ["Low", "Medium", "High"],
  },
];

interface AssessmentFormProps {
  onComplete: (recommendedTests: string[]) => void;
}

export default function AssessmentForm({ onComplete }: AssessmentFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleAnswer = (answer: any) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const recommendedTests = analyzeResults(answers);
      onComplete(recommendedTests);
    }
  };

  const analyzeResults = (answers: Record<string, any>): string[] => {
    const tests: string[] = [];

    if (answers.age > 40 || answers.familyHistory) {
      tests.push("Diabetes", "Hypertension", "Heart Disease");
    }

    if (answers.gender === "Female" && answers.age > 50) {
      tests.push("Thyroid");
    }

    if (answers.diet === "Poor" || answers.exercise === "Never") {
      tests.push("Anemia");
    }

    if (answers.smoking || answers.age > 60) {
      tests.push("COPD");
    }

    if (answers.alcohol === true || answers.age > 50) {
      tests.push("Kidney Disease");
    }

    return Array.from(new Set(tests)); // Remove duplicates
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Health Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress
          value={((currentQuestion + 1) / questions.length) * 100}
          className="mb-4"
        />
        <Question
          question={questions[currentQuestion]}
          onAnswer={handleAnswer}
        />
      </CardContent>
      <CardFooter className="justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            setCurrentQuestion(
              Math.min(questions.length - 1, currentQuestion + 1)
            )
          }
          disabled={currentQuestion === questions.length - 1}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
