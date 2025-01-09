"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square } from "lucide-react";
import { useForm } from "react-hook-form";

interface MentalVitalsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any, score: number) => void;
}

export function MentalVitalsModal({
  open,
  onOpenChange,
  onSubmit,
}: MentalVitalsModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const form = useForm({
    defaultValues: {
      stress: "5",
      anxiety: "5",
      sleep: "8",
      diet: "moderate",
      physicalActivity: "5",
      socialSupport: "3",
      reflection: "",
    },
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const calculateScore = (data: {
    stress: string;
    anxiety: string;
    sleep: string;
    diet: "healthy" | "moderate" | "unhealthy";
    physicalActivity: string;
    socialSupport: string;
  }) => {
    const weights = {
      stress: -0.2,
      anxiety: -0.2,
      sleep: 0.15,
      diet: { healthy: 0.15, moderate: 0.1, unhealthy: 0 },
      physicalActivity: 0.15,
      socialSupport: 0.15,
    };

    let score = 50; // Base score

    score += (11 - parseInt(data.stress)) * weights.stress * 10; // Invert stress scale
    score += (11 - parseInt(data.anxiety)) * weights.anxiety * 10; // Invert anxiety scale
    score += (parseFloat(data.sleep) / 12) * weights.sleep * 100; // Normalize sleep to 0-1
    score += weights.diet[data.diet] * 100;
    score +=
      (parseFloat(data.physicalActivity) / 20) * weights.physicalActivity * 100; // Normalize physical activity to 0-1
    score += parseInt(data.socialSupport) * weights.socialSupport * 20;

    return Math.round(Math.max(0, Math.min(100, score))); // Ensure score is between 0 and 100
  };

  const handleSubmit = (data: any) => {
    const score = calculateScore(data);
    onSubmit(data, score);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Mental Vitals</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stress Level (1-10)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anxiety"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anxiety Level (1-10)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sleep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleep (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="12"
                        step="0.5"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="physicalActivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Physical Activity (hours/week)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialSupport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Support (1-5)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="5" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diet Quality</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select diet quality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="healthy">Healthy</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="unhealthy">Unhealthy</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reflection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tell me about your day</FormLabel>
                  <div className="space-y-2">
                    <FormControl>
                      <Textarea
                        placeholder="Type your reflection here..."
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={isRecording ? stopRecording : startRecording}
                      >
                        {isRecording ? (
                          <Square className="h-4 w-4" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                      {audioBlob && (
                        <audio controls>
                          <source
                            src={URL.createObjectURL(audioBlob)}
                            type="audio/webm"
                          />
                        </audio>
                      )}
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
