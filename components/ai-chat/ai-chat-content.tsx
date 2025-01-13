import React, { useState, useEffect, useRef } from "react";
import Image from "next/image"; // Add this import

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
import { Mic, Phone, Bot, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  emotions?: {
    realization: number;
    calmness: number;
    disappointment: number;
    excitement: number;
    distress: number;
    surprise: number;
    amusement: number;
    awkwardness: number;
    interest: number;
  };
}

interface EmotionBarProps {
  emotion: string;
  value: number;
  color: string;
}

const EmotionBar: React.FC<EmotionBarProps> = ({ emotion, value, color }) => (
  <div className="flex items-center gap-2 w-full mb-2">
    <span className="text-sm font-medium w-32 text-gray-700">{emotion}</span>
    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${value * 100}%` }}
      />
    </div>
    <span className="text-sm text-gray-500 w-16 text-right">
      {(value * 100).toFixed(0)}%
    </span>
  </div>
);

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === "user";

  const getTop3Emotions = (emotions: any) => {
    if (!emotions) return [];
    return Object.entries(emotions)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3);
  };

  return (
    <div
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} mb-6`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Bot className="w-4 h-4 text-blue-600" />
        </div>
      )}
      <div
        className={`flex flex-col ${
          isUser ? "items-end" : "items-start"
        } max-w-[80%]`}
      >
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-800 rounded-bl-sm"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {message.emotions && (
          <Card className="mt-2 w-full">
            <CardContent className="pt-4">
              {getTop3Emotions(message.emotions).map(([emotion, value]) => (
                <EmotionBar
                  key={emotion}
                  emotion={emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                  value={value as number}
                  color={
                    emotion === "realization"
                      ? "bg-blue-500"
                      : emotion === "calmness"
                      ? "bg-sky-400"
                      : emotion === "disappointment"
                      ? "bg-teal-500"
                      : emotion === "excitement"
                      ? "bg-yellow-500"
                      : emotion === "distress"
                      ? "bg-red-500"
                      : emotion === "surprise"
                      ? "bg-purple-500"
                      : emotion === "amusement"
                      ? "bg-orange-500"
                      : emotion === "awkwardness"
                      ? "bg-pink-500"
                      : "bg-blue-500"
                  }
                />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </div>
  );
};

export function AiChatContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
    }
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleEndCall = () => {
    setMessages([]);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsListening(false);
  };

  const getEmotionPrompt = (text: string) => {
    return `Analyze this message's emotions (0-1 scale):
Message: ${text}

Return only this JSON:
{"realization": 0.0, "calmness": 0.0, "disappointment": 0.0, "excitement": 0.0, "distress": 0.0, "surprise": 0.0, "amusement": 0.0, "awkwardness": 0.0, "interest": 0.0}`;
  };

  const getHealthcarePrompt = (userInput: string) => {
    return `You are an empathetic healthcare assistant named Care Companion. Respond to this healthcare query: ${userInput}

Guidelines:
1. Keep responses under 20 words
2. Be empathetic and professional
3. Only address health-related topics
4. Never diagnose or prescribe
5. Encourage professional consultation when needed

If not health-related, say: "I can only help with health-related questions. Please feel free to ask about health matters."`;
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = async (event: any) => {
        const userInput = event.results[0][0].transcript;
        const userMessage: ChatMessage = { role: "user", content: userInput };
        setMessages((prev) => [...prev, userMessage]);
        await getAIResponse(userInput);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const getAIResponse = async (userInput: string) => {
    try {
      // Use the CHAT_API_KEY directly from env
      console.log("API Key available:", !!process.env.NEXT_PUBLIC_CHAT_API_KEY);

      // Change this line to use the correct environment variable
      const API_KEY =
        process.env.NEXT_PUBLIC_CHAT_API_KEY || process.env.CHAT_API_KEY;

      if (!API_KEY) {
        throw new Error(
          "API key is not configured. Please check your .env file"
        );
      }

      const [responseData, emotionData] = await Promise.all([
        fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: getHealthcarePrompt(userInput) }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              },
            }),
          }
        ).then((res) => res.json()),
        fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: getEmotionPrompt(userInput) }],
                },
              ],
            }),
          }
        ).then((res) => res.json()),
      ]);

      if (responseData.error) {
        throw new Error(responseData.error.message || "API error occurred");
      }

      const aiResponse =
        responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiResponse) {
        throw new Error("No response received from AI");
      }

      let emotions: ChatMessage["emotions"] = {
        realization: 0,
        calmness: 0,
        disappointment: 0,
        excitement: 0,
        distress: 0,
        surprise: 0,
        amusement: 0,
        awkwardness: 0,
        interest: 0,
      };

      try {
        const emotionText =
          emotionData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (emotionText) {
          const parsedEmotions = JSON.parse(emotionText);
          emotions = { ...emotions, ...parsedEmotions };
        }
      } catch (e) {
        console.error("Error parsing emotions:", e);
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: aiResponse,
        emotions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      speakResponse(aiResponse);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage =
        error instanceof Error
          ? `Error: ${error.message}`
          : "I'm having trouble processing your request. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
      speakResponse(errorMessage);
    }
  };

  const speakResponse = (text: string) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      synthRef.current.speak(utterance);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-gray-800">Care Companion</h2>
        <p className="text-sm text-gray-500">Your AI Healthcare Assistant</p>
      </div>

      <div className="h-[430px] overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="relative w-24 h-24 mb-4">
              <Image
                src="/bot.png"
                alt="Bot Assistant"
                fill
                className="object-contain hover:scale-110 transition-all duration-300 ease-in-out"
                priority
              />
            </div>
            <p className="text-lg font-medium mb-2">
              Welcome to Care Companion
            </p>
            <p className="text-sm">
              Start speaking to get healthcare assistance
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`flex-1 h-12 ${
              isListening
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <Mic className="w-4 h-4 mr-2" />
            {isListening ? "Listening..." : "Start Speaking"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-32 h-12">
                <Phone className="w-4 h-4 mr-2" />
                End Call
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>End Call</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to end this call? This will clear all
                  chat messages.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleEndCall}
                  className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                >
                  End Call
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}

export default AiChatContent;
