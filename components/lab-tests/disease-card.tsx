"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Disease } from "@/lib/diseases";
import { DonutChart } from "./donut-chart";
import { motion } from "framer-motion";

interface DiseaseCardProps {
  disease: Disease;
  result?: number;
  onStartTest: () => void;
}

export function DiseaseCard({
  disease,
  result,
  onStartTest,
}: DiseaseCardProps) {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const getRecommendation = (score: number) => {
    if (score < 30)
      return "Your risk appears to be low. Continue maintaining a healthy lifestyle.";
    if (score < 70)
      return "Consider discussing these results with your healthcare provider.";
    return "It's advisable to consult with a specialist for further evaluation.";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">{disease.name}</CardTitle>
        <CardDescription>{disease.description}</CardDescription>
      </CardHeader>
      <CardContent className=" flex flex-col items-center space-y-2 font-medium text-sm">
        {result !== undefined ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DonutChart value={result} onSegmentClick={setSelectedSegment} />
            <p className="text-sm text-muted-foreground">
              Risk Assessment Score
            </p>
            {selectedSegment && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {selectedSegment === "risk"
                  ? "Risk factors detected"
                  : "Healthy indicators"}
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {getRecommendation(result)}
            </motion.p>
          </motion.div>
        ) : null}
        <Button onClick={onStartTest} className="w-full">
          {result !== undefined ? "Retake Test" : "Take Test"}
        </Button>
      </CardContent>
    </Card>
  );
}
