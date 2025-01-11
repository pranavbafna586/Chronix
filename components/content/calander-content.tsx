"use client";
import { useState } from "react";
import { Calendar } from "@/components/calander/calander";
// import { Navbar } from "./components/navbar";
import PillReminderCard from "@/components/calander/pill-reminder-card";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

interface PillSchedule {
  id: string;
  name: string;
  timeOfDay: "Morning" | "Afternoon" | "Evening";
  isTaken: boolean;
}

export default function calanderContent() {
  const [score, setScore] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();

  const [pillSchedule, setPillSchedule] = useState<PillSchedule[]>([
    { id: "1", name: "Vitamin D", timeOfDay: "Morning", isTaken: false },
    { id: "2", name: "Omega 3", timeOfDay: "Afternoon", isTaken: false },
    { id: "3", name: "Magnesium", timeOfDay: "Evening", isTaken: false },
  ]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Reset pill schedule for the new date
    setPillSchedule((prevSchedule) =>
      prevSchedule.map((pill) => ({ ...pill, isTaken: false }))
    );
  };

  const handleTakePill = (pillId: string) => {
    setPillSchedule((schedule) =>
      schedule.map((pill) =>
        pill.id === pillId ? { ...pill, isTaken: true } : pill
      )
    );
    setScore((prev) => prev + 10);
    toast({
      title: "Successfully Taken Pill + 10 points",
      className: "bg-green-500 text-white",
      duration: 3000,
    });
  };

  const handleSkipPill = (pillId: string) => {
    setPillSchedule((schedule) =>
      schedule.map((pill) =>
        pill.id === pillId ? { ...pill, isTaken: true } : pill
      )
    );
    setScore((prev) => prev - 10);
    toast({
      title: "Pill Skipped - 10 points",
      description: "Remember to take your medications as prescribed!",
      className: "bg-red-500 text-white",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen">
      <Header score={score} />
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        <Calendar onDateSelect={handleDateSelect} />
        <div className="grid grid-cols-3 gap-4">
          {pillSchedule.map((pill) => (
            <PillReminderCard
              key={pill.id}
              pillName={pill.name}
              timeOfDay={pill.timeOfDay}
              date={selectedDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              day={selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
              })}
              onTakePill={() => handleTakePill(pill.id)}
              onSkipPill={() => handleSkipPill(pill.id)}
              isTaken={pill.isTaken}
            />
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
