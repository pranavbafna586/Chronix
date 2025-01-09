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
}

export function MentalFitnessDashboard({
  lastSubmission,
  mentalScore,
}: MentalFitnessDashboardProps) {
  const metrics = [
    { title: "Smoothness", value: "94.42%", icon: Activity },
    { title: "Control", value: "89.42%", icon: Brain },
    { title: "Liveliness", value: "0.45 octaves", icon: Heart },
    { title: "Energy Range", value: "5.64 dB", icon: BarChart },
    { title: "Clarity", value: "280 ms", icon: Music },
    { title: "Crispness", value: "0.48 kHz²", icon: Volume2 },
    { title: "Speech", value: "Normal", icon: Clock },
    { title: "Pause", value: "Regular", icon: Pause },
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
              className="flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
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
