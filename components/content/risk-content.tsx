"use client";

import { useState } from "react";
import AssessmentForm from "@/components/ai-risk-content/assessment-form";
import Results from "@/components/ai-risk-content/results";

export default function Home() {
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-items-start p-24">
      <h1 className="mb-8 text-4xl font-bold">AI Health Risk Assessment</h1>
      {!assessmentComplete ? (
        <AssessmentForm
          onComplete={(recommendedTests) => {
            setResults(recommendedTests);
            setAssessmentComplete(true);
          }}
        />
      ) : (
        <Results recommendedTests={results} />
      )}
    </main>
  );
}
