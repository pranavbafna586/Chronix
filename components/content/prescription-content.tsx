import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";

const prescriptionContent: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [responseJson, setResponseJson] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [editableData, setEditableData] = useState<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);

        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch (err) {
      setError(
        "Could not start recording. Please check your microphone permissions."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
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
      const response = await fetch(
        "https://flaskapphealthcare-1.onrender.com",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setResponseJson(data);
      setEditableData(parseMedicineData(data)); // Set editable data
    } catch (err: any) {
      setError(`Failed to upload audio: ${err.message}`);
    }
  };

  const parseMedicineData = (response: any) => {
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

  const handleFieldChange = (field: string, value: string) => {
    if (!editableData) return;
    setEditableData({ ...editableData, [field]: value });
  };

  const handleTableChange = (index: number, key: string, value: string) => {
    if (!editableData?.medicine_table) return;
    const updatedTable = editableData.medicine_table.map(
      (medicine: any, i: number) =>
        i === index ? { ...medicine, [key]: value } : medicine
    );
    setEditableData({ ...editableData, medicine_table: updatedTable });
  };

  const downloadPDF = () => {
    const doc = new jsPDF() as jsPDF & { autoTable: (options: any) => void };
    autoTable(doc, {});

    if (editableData) {
      doc.text("Prescription Details", 10, 10);
      doc.text(`Hospital: ${editableData.hospital_name || ""}`, 10, 20);
      doc.text(`Doctor: ${editableData.doctor_name || ""}`, 10, 30);
      doc.text(`Patient: ${editableData.patient_name || ""}`, 10, 40);
      doc.text(`Date: ${editableData.date || ""}`, 10, 50);

      if (editableData.medicine_table) {
        const tableData = editableData.medicine_table.map((row: any) => [
          row["Sr.No"],
          row["Medicine Name"],
          row["Dosage Time"],
          row["Instruction"],
        ]);

        doc.autoTable({
          head: [["Sr. No", "Medicine Name", "Timing", "Instructions"]],
          body: tableData,
          startY: 60,
        });
      }
    }

    doc.save("Prescription.pdf");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Prescription Generator</h1>

      <div className="mt-4">
        {recording ? (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={stopRecording}
          >
            Stop Recording
          </button>
        ) : (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={startRecording}
          >
            Start Recording
          </button>
        )}

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          onClick={uploadAudio}
          disabled={!audioBlob}
        >
          Upload Audio
        </button>
      </div>

      {audioURL && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Preview</h2>
          <audio controls src={audioURL} className="w-full mt-2" />
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {editableData && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Prescription Details</h2>

          <input
            className="mb-2 border p-2 rounded w-full"
            value={editableData.hospital_name || ""}
            onChange={(e) => handleFieldChange("hospital_name", e.target.value)}
            placeholder="Hospital Name"
          />
          <input
            className="mb-2 border p-2 rounded w-full"
            value={editableData.doctor_name || ""}
            onChange={(e) => handleFieldChange("doctor_name", e.target.value)}
            placeholder="Doctor Name"
          />
          <input
            className="mb-2 border p-2 rounded w-full"
            value={editableData.patient_name || ""}
            onChange={(e) => handleFieldChange("patient_name", e.target.value)}
            placeholder="Patient Name"
          />
          <input
            className="mb-2 border p-2 rounded w-full"
            value={editableData.date || ""}
            onChange={(e) => handleFieldChange("date", e.target.value)}
            placeholder="Date"
          />

          {editableData.medicine_table && (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="px-6 py-3">Sr. No</th>
                  <th className="px-6 py-3">Medicine Name</th>
                  <th className="px-6 py-3">Timing</th>
                  <th className="px-6 py-3">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {editableData.medicine_table.map(
                  (medicine: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <input
                          className="w-full border rounded p-1"
                          value={medicine["Sr.No"]}
                          onChange={(e) =>
                            handleTableChange(index, "Sr.No", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          className="w-full border rounded p-1"
                          value={medicine["Medicine Name"]}
                          onChange={(e) =>
                            handleTableChange(
                              index,
                              "Medicine Name",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          className="w-full border rounded p-1"
                          value={medicine["Dosage Time"]}
                          onChange={(e) =>
                            handleTableChange(
                              index,
                              "Dosage Time",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          className="w-full border rounded p-1"
                          value={medicine["Instruction"]}
                          onChange={(e) =>
                            handleTableChange(
                              index,
                              "Instruction",
                              e.target.value
                            )
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}

          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default prescriptionContent;
