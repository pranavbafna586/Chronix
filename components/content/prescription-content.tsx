"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mic, MicOff, Download, Edit2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface MedicineRow {
  "Sr.No": string | number;
  "Medicine Name": string;
  "Dosage Time": string;
  Instruction: string;
}

interface PrescriptionData {
  hospital_name?: string;
  doctor_name?: string;
  patient_name?: string;
  date?: string;
  medicine_table: MedicineRow[];
}

export function prescriptionContent() {
  const [recording, setRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [responseJson, setResponseJson] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<MedicineRow | {}>({});
  const [canUpload, setCanUpload] = useState<boolean>(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const prescriptionRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        setCanUpload(true);

        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);

        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            localStorage.setItem("recordedAudio", reader.result.toString());
          }
        };
        reader.readAsDataURL(audioBlob);

        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
      setCanUpload(false);
    } catch (err) {
      setError(
        "Could not start recording. Please check your microphone permissions."
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) {
      setError("No audio recorded.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setResponseJson(data);
    } catch (err: any) {
      setError(`Failed to upload audio: ${err.message}`);
    }
  };

  const handleEdit = (index: number) => {
    if (prescriptionData?.medicine_table[index]) {
      setEditingRow(index);
      setEditedValues(prescriptionData.medicine_table[index]);
    }
  };

  const handleSave = (index: number) => {
    if (!prescriptionData) return;

    const updatedTable = [...prescriptionData.medicine_table];
    updatedTable[index] = editedValues as MedicineRow;

    const updatedPrescriptionData = {
      ...prescriptionData,
      medicine_table: updatedTable,
    };

    setResponseJson({
      ...responseJson,
      data: `\`\`\`json\n${JSON.stringify(
        updatedPrescriptionData,
        null,
        2
      )}\n\`\`\``,
    });

    setEditingRow(null);
    setEditedValues({});
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedValues({});
  };

  const handleInputChange = (field: keyof MedicineRow, value: string) => {
    setEditedValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const downloadPDF = async () => {
    if (!pdfContentRef.current) return;

    try {
      const canvas = await html2canvas(pdfContentRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;
      const availableWidth = pageWidth - margin * 2;
      const aspectRatio = canvas.height / canvas.width;
      const imgHeight = availableWidth * aspectRatio;

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        margin,
        margin,
        availableWidth,
        imgHeight
      );

      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      const footerText = `Generated on: ${new Date().toLocaleDateString()}`;
      pdf.text(footerText, margin, pageHeight - margin);

      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "prescription.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("Failed to download PDF");
    }
  };

  const parseMedicineData = (response: any): PrescriptionData | null => {
    try {
      if (!response?.data) return null;
      const jsonMatch = response.data.match(/```json\n([\s\S]*)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      return null;
    } catch (error) {
      console.error("Error parsing response:", error);
      return null;
    }
  };

  const prescriptionData = responseJson
    ? parseMedicineData(responseJson)
    : null;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Voice Prescription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={recording ? stopRecording : startRecording}
            variant={recording ? "destructive" : "default"}
          >
            {recording ? (
              <MicOff className="mr-2 h-4 w-4" />
            ) : (
              <Mic className="mr-2 h-4 w-4" />
            )}
            {recording ? "Stop Recording" : "Start Recording"}
          </Button>

          {recording && (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}

          <Button
            variant="default"
            onClick={uploadAudio}
            disabled={!audioBlob || !canUpload}
          >
            Upload Audio
          </Button>

          {prescriptionData && (
            <Button onClick={downloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          )}
        </div>

        {audioURL && (
          <div className="mt-4">
            <audio controls src={audioURL} className="w-full" />
          </div>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {prescriptionData && (
          <div
            className="space-y-4 bg-white p-8 rounded-lg"
            ref={prescriptionRef}
          >
            {/* PDF content */}
            <div
              className="space-y-6 border p-6 rounded-lg"
              ref={pdfContentRef}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  Medical Prescription
                </h1>
                {prescriptionData.hospital_name && (
                  <p className="text-xl text-gray-700">
                    {prescriptionData.hospital_name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  {prescriptionData.doctor_name && (
                    <p className="mb-2">
                      <span className="font-semibold">Doctor:</span>{" "}
                      {prescriptionData.doctor_name}
                    </p>
                  )}
                  {prescriptionData.date && (
                    <p className="mb-2">
                      <span className="font-semibold">Date:</span>{" "}
                      {prescriptionData.date}
                    </p>
                  )}
                </div>
                <div>
                  {prescriptionData.patient_name && (
                    <p className="mb-2">
                      <span className="font-semibold">Patient:</span>{" "}
                      {prescriptionData.patient_name}
                    </p>
                  )}
                </div>
              </div>

              {prescriptionData.medicine_table &&
                prescriptionData.medicine_table.length > 0 && (
                  <Table className="border-collapse border border-gray-200">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="border p-3 text-left font-semibold">
                          Sr. No
                        </TableHead>
                        <TableHead className="border p-3 text-left font-semibold">
                          Medicine Name
                        </TableHead>
                        <TableHead className="border p-3 text-left font-semibold">
                          Timing
                        </TableHead>
                        <TableHead className="border p-3 text-left font-semibold">
                          Instructions
                        </TableHead>
                        <TableHead className="border p-3 text-left font-semibold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prescriptionData.medicine_table.map(
                        (medicine, index) => (
                          <TableRow
                            key={medicine["Sr.No"]}
                            className="hover:bg-gray-50"
                          >
                            <TableCell className="border p-3">
                              {medicine["Sr.No"]}
                            </TableCell>
                            <TableCell className="border p-3">
                              {editingRow === index ? (
                                <Input
                                  value={
                                    (editedValues as MedicineRow)[
                                      "Medicine Name"
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      "Medicine Name",
                                      e.target.value
                                    )
                                  }
                                  className="w-full"
                                />
                              ) : (
                                medicine["Medicine Name"]
                              )}
                            </TableCell>
                            <TableCell className="border p-3">
                              {editingRow === index ? (
                                <Input
                                  value={
                                    (editedValues as MedicineRow)[
                                      "Dosage Time"
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      "Dosage Time",
                                      e.target.value
                                    )
                                  }
                                  className="w-full"
                                />
                              ) : (
                                medicine["Dosage Time"]
                              )}
                            </TableCell>
                            <TableCell className="border p-3">
                              {editingRow === index ? (
                                <Input
                                  value={
                                    (editedValues as MedicineRow)[
                                      "Instruction"
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      "Instruction",
                                      e.target.value
                                    )
                                  }
                                  className="w-full"
                                />
                              ) : (
                                medicine["Instruction"]
                              )}
                            </TableCell>
                            <TableCell className="border p-3">
                              {editingRow === index ? (
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleSave(index)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={handleCancel}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(index)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
