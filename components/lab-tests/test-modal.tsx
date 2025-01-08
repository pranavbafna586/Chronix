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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Disease } from "@/lib/diseases";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, Minus, Plus } from "lucide-react";

interface TestModalProps {
  disease: Disease | null;
  onClose: () => void;
  onComplete: (diseaseId: string, score: number) => void;
}

export function TestModal({ disease, onClose, onComplete }: TestModalProps) {
  const [answers, setAnswers] = useState<Record<string, number | boolean>>({});
  const [parameters, setParameters] = useState<Record<string, number>>({});
  const [followUpAnswers, setFollowUpAnswers] = useState<
    Record<string, boolean>
  >({});

  if (!disease) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate score based on answers and parameters
    const questionScore = Object.values(answers).reduce((score, answer) => {
      if (typeof answer === "number") {
        return score + (answer / 10) * 20;
      } else {
        return score + (answer ? 20 : 0);
      }
    }, 0);

    const parameterScore = Object.entries(parameters).reduce(
      (score, [key, value]) => {
        const param = disease.parameters.find((p) => p.id === key);
        if (!param) return score;

        const [min, max] = param.average.split("-").map(parseFloat);
        const avgValue = (min + max) / 2;

        return score + (Math.abs(value - avgValue) < avgValue * 0.1 ? 10 : 0);
      },
      0
    );

    const followUpScore = Object.values(followUpAnswers).reduce(
      (score, answer) => {
        return score + (answer ? 10 : 0);
      },
      0
    );

    const totalScore = Math.min(
      100,
      ((questionScore + parameterScore + followUpScore) / (100 + 50 + 50)) * 100
    );
    onComplete(disease.id, totalScore);
  };

  const handleSliderChange = (questionIndex: number, value: number[]) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value[0] }));
  };

  const handleToggleChange = (questionIndex: number, checked: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: checked }));

    // Check if follow-up question should be shown
    if (checked && disease.questions[questionIndex].followUp) {
      setFollowUpAnswers((prev) => ({ ...prev, [questionIndex]: false }));
    } else {
      setFollowUpAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[questionIndex];
        return newAnswers;
      });
    }
  };

  const handleParameterChange = (paramId: string, value: number) => {
    setParameters((prev) => ({ ...prev, [paramId]: value }));
  };

  return (
    <Dialog open={!!disease} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{disease.name} Assessment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Questions</h3>
            {disease.questions.map((question, index) => (
              <div key={index} className="space-y-2">
                <Label>{question.text}</Label>
                {question.type === "slider" ? (
                  <div className="space-y-2">
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      value={[(answers[index] as number) || 0]}
                      onValueChange={(value) =>
                        handleSliderChange(index, value)
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Rarely</span>
                      <span>Always</span>
                    </div>
                  </div>
                ) : (
                  <Switch
                    checked={!!answers[index]}
                    onCheckedChange={(checked) =>
                      handleToggleChange(index, checked)
                    }
                  />
                )}
                {followUpAnswers.hasOwnProperty(index) && (
                  <div className="ml-6 mt-2">
                    <Label>{question.followUp}</Label>
                    <Switch
                      checked={!!followUpAnswers[index]}
                      onCheckedChange={(checked) =>
                        setFollowUpAnswers((prev) => ({
                          ...prev,
                          [index]: checked,
                        }))
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Parameters</h3>
            {disease.parameters.map((param) => (
              <div key={param.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor={param.id}>{param.label}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Average range: {param.average}</p>
                        {param.helper && <p>{param.helper}</p>}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleParameterChange(
                        param.id,
                        (parameters[param.id] || 0) - 1
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id={param.id}
                    type="number"
                    placeholder={`Avg: ${param.average}`}
                    value={parameters[param.id] || ""}
                    onChange={(e) =>
                      handleParameterChange(
                        param.id,
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-24 text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleParameterChange(
                        param.id,
                        (parameters[param.id] || 0) + 1
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
