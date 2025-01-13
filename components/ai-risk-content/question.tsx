import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type QuestionType = "number" | "boolean" | "select";

interface QuestionData {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // Only required if type is "select"
}

interface QuestionProps {
  question: QuestionData;
  onAnswer: (answer: any) => void;
}

export default function Question({ question, onAnswer }: QuestionProps) {
  const [answer, setAnswer] = useState<any>("");

  const handleChange = (value: any) => {
    setAnswer(value);
    onAnswer(value);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor={question.id}>{question.text}</Label>
      {question.type === "number" && (
        <Input
          id={question.id}
          type="number"
          value={answer}
          onChange={(e) => handleChange(parseInt(e.target.value, 10))}
        />
      )}
      {question.type === "select" && question.options && (
        <Select onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {question.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {question.type === "boolean" && (
        <RadioGroup onValueChange={(value) => handleChange(value === "true")}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id={`${question.id}-yes`} />
            <Label htmlFor={`${question.id}-yes`}>Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id={`${question.id}-no`} />
            <Label htmlFor={`${question.id}-no`}>No</Label>
          </div>
        </RadioGroup>
      )}
    </div>
  );
}
