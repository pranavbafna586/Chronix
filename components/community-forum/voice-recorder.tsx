"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";

interface VoiceRecorderProps {
  onStop: (blob: Blob) => void;
}

export function VoiceRecorder({ onStop }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(true);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          chunksRef.current = [];
          onStop(blob);
        };

        mediaRecorder.start();
        interval = setInterval(() => {
          setDuration((d) => d + 1);
        }, 1000);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    startRecording();

    return () => {
      if (interval) clearInterval(interval);
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [onStop, isRecording]);

  const handleStop = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsRecording(false);
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-4 bg-muted p-3 rounded-lg">
      <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
      <span className="text-sm font-medium">{formatDuration(duration)}</span>
      <div className="flex-1 h-2 bg-primary/20 rounded-full">
        <div
          className="h-full bg-primary rounded-full animate-[progress_1s_ease-in-out_infinite]"
          style={{ width: `${(duration % 3) * 33.33}%` }}
        />
      </div>
      <Button variant="ghost" size="icon" onClick={handleStop}>
        <Square className="h-5 w-5" />
      </Button>
    </div>
  );
}
