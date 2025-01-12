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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios"; // Import axios

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
      gender: "Male",
      occupation: "Corporate",
      moodSwings: "Medium",
      changesHabits: "No",
      workInterest: "No",
      socialWeakness: "Yes",
      reflection: "",
    },
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm", // Specify the desired format
      });
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop());
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

  const handleSubmit = async (data: any) => {
    try {
      // Submit form data to /predict endpoint
      const predictResponse = await axios.post(
        "http://127.0.0.1:5000/predict",
        {
          gender: data.gender,
          Occupation: data.occupation,
          Mood_Swings: data.moodSwings,
          Changes_Habits: data.changesHabits,
          Work_Interest: data.workInterest,
          Social_Weakness: data.socialWeakness,
        }
      );

      const score = predictResponse.data.mental_fitness_score;

      // Submit audio file if available
      if (audioBlob) {
        try {
          const formData = new FormData();
          // Make sure to append with the correct filename and type
          formData.append("audio", audioBlob, "recording.webm");

          const voiceResponse = await axios.post(
            "http://127.0.0.1:5000/voice_analysis",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log("Voice Analysis Response:", voiceResponse.data);
          localStorage.setItem(
            "voiceAnalysisResponse",
            JSON.stringify(voiceResponse.data)
          );
          // Handle the voice analysis response as needed
        } catch (voiceError) {
          console.error("Error in voice analysis:", voiceError);
        }
      }

      // Call the onSubmit prop with the form data and score
      onSubmit(data, score);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mental Health Assessment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3 border border-gray-500 p-3 rounded-md">
                      <FormLabel className="text-base font-semibold">
                        Gender
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Male" id="gender-male" />
                            <label htmlFor="gender-male">Male</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Female" id="gender-female" />
                            <label htmlFor="gender-female">Female</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="moodSwings"
                  render={({ field }) => (
                    <FormItem className="space-y-3 border border-gray-500 p-3 rounded-md">
                      <FormLabel className="text-base font-semibold">
                        Mood Swings
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {["Medium", "Low", "High"].map((value) => (
                            <div
                              key={value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={value}
                                id={`mood-${value.toLowerCase()}`}
                              />
                              <label htmlFor={`mood-${value.toLowerCase()}`}>
                                {value}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem className="space-y-3 border border-gray-500 p-3 rounded-md">
                      <FormLabel className="text-base font-semibold">
                        Occupation
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {[
                            "Corporate",
                            "Student",
                            "Business",
                            "Housewife",
                            "Others",
                          ].map((value) => (
                            <div
                              key={value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={value}
                                id={`occupation-${value.toLowerCase()}`}
                              />
                              <label
                                htmlFor={`occupation-${value.toLowerCase()}`}
                              >
                                {value}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6 ">
                <FormField
                  control={form.control}
                  name="workInterest"
                  render={({ field }) => (
                    <FormItem className="space-y-3 border border-gray-500 p-3 rounded-md">
                      <FormLabel className="text-base font-semibold">
                        Interest in Work
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {["No", "Maybe", "Yes"].map((value) => (
                            <div
                              key={value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={value}
                                id={`work-${value.toLowerCase()}`}
                              />
                              <label htmlFor={`work-${value.toLowerCase()}`}>
                                {value}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="changesHabits"
                  render={({ field }) => (
                    <FormItem className="space-y-3 border border-gray-500 p-3 rounded-md">
                      <FormLabel className="text-base font-semibold">
                        Changes in Habits
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {["No", "Yes", "Maybe"].map((value) => (
                            <div
                              key={value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={value}
                                id={`habits-${value.toLowerCase()}`}
                              />
                              <label htmlFor={`habits-${value.toLowerCase()}`}>
                                {value}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialWeakness"
                  render={({ field }) => (
                    <FormItem className="space-y-3 border border-gray-500 p-3 rounded-md">
                      <FormLabel className="text-base font-semibold">
                        Social Weakness
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {["Yes", "No", "Maybe"].map((value) => (
                            <div
                              key={value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={value}
                                id={`social-${value.toLowerCase()}`}
                              />
                              <label htmlFor={`social-${value.toLowerCase()}`}>
                                {value}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="reflection"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <div className="flex items-center gap-7">
                      <FormLabel className="text-base font-semibold">
                        Tell me about your day
                      </FormLabel>
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
