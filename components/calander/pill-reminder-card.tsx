"use client";

import { Pill, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PillReminderProps {
  pillName: string;
  timeOfDay: "Morning" | "Afternoon" | "Evening";
  date: string;
  day: string;
  onTakePill: () => void;
  onSkipPill: () => void;
  isTaken: boolean;
}

export default function PillReminderCard({
  pillName,
  timeOfDay,
  date,
  day,
  onTakePill,
  onSkipPill,
  isTaken,
}: PillReminderProps) {
  return (
    <Card className="w-full max-w-md bg-white shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Pill className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {pillName}
              </h3>
              <Badge variant="secondary" className="mt-1 text-sm font-medium">
                {timeOfDay}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">{date}</p>
            <p className="text-xs text-gray-400 mt-1">{day}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-red-200 hover:border-red-300 hover:bg-red-50"
            onClick={onSkipPill}
            disabled={isTaken}
          >
            <X className="w-4 h-4 text-red-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-green-200 hover:border-green-300 hover:bg-green-50"
            onClick={onTakePill}
            disabled={isTaken}
          >
            <Check className="w-4 h-4 text-green-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
