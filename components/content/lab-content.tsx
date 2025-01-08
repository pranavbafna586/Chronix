"use client";

import { useState } from "react";
import { DiseaseCard } from "@/components/lab-tests/disease-card";
import { TestModal } from "@/components/lab-tests/test-modal";
import { Disease, diseases } from "@/lib/diseases";

export function labContent() {
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [testResults, setTestResults] = useState<Record<string, number>>({});

  const handleStartTest = (disease: Disease) => {
    setSelectedDisease(disease);
  };

  const handleTestComplete = (diseaseId: string, score: number) => {
    setTestResults((prev) => ({
      ...prev,
      [diseaseId]: score,
    }));
    setSelectedDisease(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {diseases.map((disease) => (
        <DiseaseCard
          key={disease.id}
          disease={disease}
          result={testResults[disease.id]}
          onStartTest={() => handleStartTest(disease)}
        />
      ))}
      <TestModal
        disease={selectedDisease}
        onClose={() => setSelectedDisease(null)}
        onComplete={handleTestComplete}
      />
    </div>
  );
}
