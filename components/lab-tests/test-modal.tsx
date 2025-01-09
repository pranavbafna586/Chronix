"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Disease } from "@/lib/diseases";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { predictDisease } from "@/lib/api";

interface TestModalProps {
  disease: Disease | null;
  onClose: () => void;
  onComplete: (diseaseId: string, score: number) => void;
}

export function TestModal({ disease, onClose, onComplete }: TestModalProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});

  if (!disease) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = disease.questions.reduce((acc, question, index) => {
      // Add main answer
      acc[question.text.toLowerCase().replace(/\s+/g, '_')] = answers[index];
      
      // Add follow-up answer if exists
      if (question.followUp && answers[index] === 'Yes') {
        acc[question.followUp.text.toLowerCase().replace(/\s+/g, '_')] = followUpAnswers[index];
      }
      
      return acc;
    }, {} as Record<string, string>);

    try {
      const score = await predictDisease(disease.id, formData);
      onComplete(disease.id, score);
    } catch (error) {
      console.log(formData);
      console.error('Failed to get prediction:', error);
      // Handle error appropriately
    }
  };

  const renderQuestion = (question: Disease['questions'][0], index: number) => {
    const inputId = `question-${index}`;
    const questionValue = answers[index];

    return (
      <div key={index} className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor={inputId}>
            {question.text}
            {question.unit ? ` (${question.unit})` : ''}
          </Label>
          {question.tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{question.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {question.type === 'radio' ? (
          <RadioGroup
            value={questionValue}
            onValueChange={(value) => setAnswers((prev) => ({ ...prev, [index]: value }))}
          >
            <div className="flex gap-4">
              {question.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${inputId}-${option}`} />
                  <Label htmlFor={`${inputId}-${option}`}>{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        ) : (
          <div className="relative">
            <Input
              id={inputId}
              type="number"
              value={questionValue || ''}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [index]: e.target.value }))}
              className="w-full"
              placeholder={question.tooltip || `Enter ${question.text.toLowerCase()}`}
            />
          </div>
        )}

        {/* Render follow-up question if applicable */}
        {question.followUp && questionValue === 'Yes' && (
          <div className="ml-6 mt-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor={`followup-${index}`}>
                {question.followUp.text}
                {question.followUp.unit ? ` (${question.followUp.unit})` : ''}
              </Label>
              {question.followUp.tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{question.followUp.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <Input
              id={`followup-${index}`}
              type="number"
              value={followUpAnswers[index] || ''}
              onChange={(e) =>
                setFollowUpAnswers((prev) => ({ ...prev, [index]: e.target.value }))
              }
              className="w-full"
              placeholder={question.followUp.tooltip || `Enter ${question.followUp.text.toLowerCase()}`}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={!!disease} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{disease.name} Assessment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {disease.questions.map((question, index) => renderQuestion(question, index))}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}