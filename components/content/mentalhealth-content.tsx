"use client";

import { useState } from "react";
import { MentalVitalsModal } from "@/components/mental-health/mental-vitals-modal";
import { MentalFitnessDashboard } from "@/components/mental-health/mental-fitness-dashboard";
import { Button } from "@/components/ui/button";

export default function MentalHealthPage() {
  const [showModal, setShowModal] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<Date | null>(null);
  const [mentalScore, setMentalScore] = useState<number | null>(null);
  const [voiceAnalysis, setVoiceAnalysis] = useState<any>(null);

  const handleSubmit = (data: any, score: number, voiceAnalysis?: any) => {
    setLastSubmission(new Date());
    setMentalScore(score);
    if (voiceAnalysis) {
      setVoiceAnalysis(voiceAnalysis);
    }
    setShowModal(false);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={() => setShowModal(true)}>Record Mental Vitals</Button>
      </div>

      <MentalFitnessDashboard
        lastSubmission={lastSubmission}
        mentalScore={mentalScore}
        voiceAnalysis={voiceAnalysis}
      />
      <MentalVitalsModal
        open={showModal}
        onOpenChange={setShowModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
