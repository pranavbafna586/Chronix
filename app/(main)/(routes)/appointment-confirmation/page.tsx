"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const AppointmentConfirmation: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctor = searchParams.get("doctor");
  const appointmentDate = searchParams.get("appointmentDate");
  const selectedTime = searchParams.get("selectedTime");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="bg-card p-8 rounded-lg shadow-lg text-center max-w-md">
        <div className="mb-4">
          <img
            src="/success.gif" 
            alt="Success"
            className="mx-auto w-50 h-30"
          />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Your appointment request has been successfully submitted!
        </h1>
        <p className="text-muted-foreground mb-6">
          We&apos;ll be in touch shortly to confirm.
        </p>

        <div className="bg-popover p-4 rounded-lg mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            Requested appointment details:
          </p>
          <div className="flex items-center justify-between mb-2">
            <p className="text-foreground font-medium">Doctor:</p>
            <p className="text-secondary-foreground">{doctor || "N/A"}</p>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-foreground font-medium">Date:</p>
            <p className="text-secondary-foreground">{appointmentDate || "N/A"}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-foreground font-medium">Time:</p>
            <p className="text-secondary-foreground">{selectedTime || "N/A"}</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/newappointment")}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-primary-foreground hover:text-primary transition"
        >
          New Appointment
        </button>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
