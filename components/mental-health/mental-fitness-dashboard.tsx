"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  BarChart,
  Brain,
  Clock,
  Heart,
  Music,
  Pause,
  Volume2,
} from "lucide-react";
import { RadialChart } from "@/components/mental-health/radial-chart";

interface MentalFitnessDashboardProps {
  lastSubmission: Date | null;
  mentalScore: number | null;
  voiceAnalysis: {
    Clarity: string;
    Control: string;
    Crispness: string;
    Energy_range: string;
    Liveliness: string;
    Pause: string;
    Smoothness: string;
    Speech: string;
  } | null;
}

export function MentalFitnessDashboard({
  lastSubmission,
  mentalScore,
  voiceAnalysis,
}: MentalFitnessDashboardProps) {
  const storedVoiceAnalysis =
    JSON.parse(localStorage.getItem("voiceAnalysisResponse") || "{}")
      .voice_analysis || {};

  const metrics = [
    {
      title: "Smoothness",
      value: storedVoiceAnalysis.Smoothness || "N/A",
      icon: Activity,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Control",
      value: storedVoiceAnalysis.Control || "N/A",
      icon: Brain,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Liveliness",
      value: storedVoiceAnalysis.Liveliness || "N/A",
      icon: Heart,
      color: "bg-red-100 text-red-800",
    },
    {
      title: "Energy Range",
      value: storedVoiceAnalysis.Energy_range || "N/A",
      icon: BarChart,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Clarity",
      value: storedVoiceAnalysis.Clarity || "N/A",
      icon: Music,
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Crispness",
      value: storedVoiceAnalysis.Crispness || "N/A",
      icon: Volume2,
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      title: "Speech",
      value: storedVoiceAnalysis.Speech || "N/A",
      icon: Clock,
      color: "bg-teal-100 text-teal-800",
    },
    {
      title: "Pause",
      value: storedVoiceAnalysis.Pause || "N/A",
      icon: Pause,
      color: "bg-pink-100 text-pink-800",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <RadialChart
            score={mentalScore || 0}
            remark={getRemark(mentalScore || 0)}
            lastReading={
              lastSubmission ? lastSubmission.toLocaleString() : "N/A"
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={index}
              className={`flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 ${metric.color}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-8 w-8" /> {/* Increased icon size */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {lastSubmission?.toLocaleString() || "Never"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function getRemark(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Improvement";
}
