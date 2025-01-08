"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Download } from "lucide-react";
import jsPDF from "jspdf";

interface Prescription {
  hospitalName: string;
  doctorName: string;
  patientName: string;
  medicines: {
    id: number;
    name: string;
    dosage: string;
    instructions: string;
  }[];
}

export function prescriptionContent() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      // Reset prescription when starting new recording
      setPrescription(null);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      // Start loading state and fetch prescription data
      setIsLoading(true);
      fetchPrescriptionData();
    }
  };

  const fetchPrescriptionData = () => {
    // Simulating API call with mock data
    setTimeout(() => {
      setPrescription({
        hospitalName: "City General Hospital",
        doctorName: "Dr. Jane Smith",
        patientName: "John Doe",
        medicines: [
          {
            id: 1,
            name: "Amoxicillin",
            dosage: "500mg",
            instructions: "Take twice daily",
          },
          {
            id: 2,
            name: "Ibuprofen",
            dosage: "400mg",
            instructions: "Take as needed for pain",
          },
        ],
      });
      setIsLoading(false);
    }, 1500); // Increased timeout to simulate API call
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Prescription
  ) => {
    setPrescription((prev) =>
      prev ? { ...prev, [field]: e.target.value } : null
    );
  };

  const handleMedicineChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    field: string
  ) => {
    setPrescription((prev) =>
      prev
        ? {
            ...prev,
            medicines: prev.medicines.map((med) =>
              med.id === id ? { ...med, [field]: e.target.value } : med
            ),
          }
        : null
    );
  };

  const downloadPrescription = () => {
    if (!prescription) return;

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Medical Prescription", 105, 20, { align: "center" });

    // Add date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const date = new Date().toLocaleDateString();
    doc.text(`Date: ${date}`, 20, 35);

    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    // Add medicines table
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Medicine Details", 20, 55);

    // Table headers
    doc.setFontSize(12);
    doc.text("Sr. No.", 20, 65);
    doc.text("Medicine Name", 50, 65);
    doc.text("Timing", 150, 65);

    // Add line under headers
    doc.line(20, 68, 190, 68);

    // Add medicines data
    doc.setFont("helvetica", "normal");
    let yPos = 78;

    prescription?.medicines.forEach((medicine, index) => {
      doc.text((index + 1).toString(), 20, yPos);
      doc.text(medicine.name, 50, yPos);
      doc.text(medicine.dosage, 150, yPos);
      yPos += 10;
    });

    // Add footer line
    doc.line(20, yPos + 5, 190, yPos + 5);

    // Add footer text
    doc.setFontSize(10);
    doc.setTextColor(128);
    doc.text("This is a computer-generated prescription", 105, yPos + 15, {
      align: "center",
    });

    // Save the PDF
    const timestamp = new Date().getTime();
    doc.save(`prescription_${timestamp}.pdf`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Voice Prescription Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "default"}
          >
            {isRecording ? (
              <MicOff className="mr-2 h-4 w-4" />
            ) : (
              <Mic className="mr-2 h-4 w-4" />
            )}
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          {isRecording && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="ml-2 text-sm text-red-500">
                Recording in progress...
              </span>
            </div>
          )}
        </div>

        {audioURL && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Recorded Audio</h3>
            <audio src={audioURL} controls className="w-full" />
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Processing audio and generating prescription...
            </p>
          </div>
        )}

        {prescription && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hospital Name</label>
                <Input
                  value={prescription.hospitalName}
                  onChange={(e) => handleInputChange(e, "hospitalName")}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Doctor's Name</label>
                <Input
                  value={prescription.doctorName}
                  onChange={(e) => handleInputChange(e, "doctorName")}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Patient's Name</label>
                <Input
                  value={prescription.patientName}
                  onChange={(e) => handleInputChange(e, "patientName")}
                  className="w-full"
                />
              </div>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[80px] font-semibold">
                      Sr. No.
                    </TableHead>
                    <TableHead className="font-semibold">Medicine</TableHead>
                    <TableHead className="font-semibold">Dosage</TableHead>
                    <TableHead className="font-semibold">
                      Instructions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescription.medicines.map((medicine, index) => (
                    <TableRow key={medicine.id} className="hover:bg-gray-50">
                      <TableCell className="text-center font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Input
                          value={medicine.name}
                          onChange={(e) =>
                            handleMedicineChange(e, medicine.id, "name")
                          }
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={medicine.dosage}
                          onChange={(e) =>
                            handleMedicineChange(e, medicine.id, "dosage")
                          }
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={medicine.instructions}
                          onChange={(e) =>
                            handleMedicineChange(e, medicine.id, "instructions")
                          }
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Button onClick={downloadPrescription} className="w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download Prescription
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
