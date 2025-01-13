import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Pill,
  Heart,
  Weight,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Appointment {
  id: number;
  patientName: string;
  age: number;
  phone: string;
  email: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  reason: string;
  bloodPressure?: string;
  weight?: string;
  heartRate?: string;
  previousVisit?: string;
  allergies?: string;
  medications?: string;
}

export const DrAppointmentsContent = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patientName: "Arjun Patel",
      age: 35,
      phone: "+91 98765-43210",
      email: "arjun.patel@email.com",
      date: "2025-01-15",
      time: "10:00 AM",
      status: "pending",
      reason: "Annual health checkup",
      bloodPressure: "120/80",
      weight: "75 kg",
      heartRate: "72 bpm",
      previousVisit: "2024-12-15",
      allergies: "None",
      medications: "Vitamin D supplements",
    },
    {
      id: 2,
      patientName: "Priya Sharma",
      age: 28,
      phone: "+91 87654-32109",
      email: "priya.s@email.com",
      date: "2025-01-15",
      time: "11:00 AM",
      status: "confirmed",
      reason: "Follow-up consultation",
      bloodPressure: "118/75",
      weight: "62 kg",
      heartRate: "68 bpm",
      previousVisit: "2024-12-20",
      allergies: "Peanuts",
      medications: "None",
    },
    {
      id: 3,
      patientName: "Rajesh Kumar",
      age: 45,
      phone: "+91 76543-21098",
      email: "rajesh.k@email.com",
      date: "2025-01-15",
      time: "12:00 PM",
      status: "pending",
      reason: "Blood pressure monitoring",
      bloodPressure: "140/90",
      weight: "82 kg",
      heartRate: "76 bpm",
      previousVisit: "2024-12-10",
      allergies: "Penicillin",
      medications: "Amlodipine 5mg",
    },
    {
      id: 4,
      patientName: "Meera Gupta",
      age: 32,
      phone: "+91 65432-10987",
      email: "meera.g@email.com",
      date: "2025-01-15",
      time: "2:00 PM",
      status: "confirmed",
      reason: "Diabetes consultation",
      bloodPressure: "122/78",
      weight: "65 kg",
      heartRate: "70 bpm",
      previousVisit: "2024-12-25",
      allergies: "None",
      medications: "Metformin 500mg",
    },
    {
      id: 5,
      patientName: "Suresh Reddy",
      age: 52,
      phone: "+91 54321-09876",
      email: "suresh.r@email.com",
      date: "2025-01-15",
      time: "3:00 PM",
      status: "pending",
      reason: "Joint pain assessment",
      bloodPressure: "128/82",
      weight: "78 kg",
      heartRate: "74 bpm",
      previousVisit: "2024-12-05",
      allergies: "Sulfa drugs",
      medications: "Calcium supplements",
    },
    {
      id: 6,
      patientName: "Anita Desai",
      age: 29,
      phone: "+91 43210-98765",
      email: "anita.d@email.com",
      date: "2025-01-15",
      time: "4:00 PM",
      status: "confirmed",
      reason: "Pregnancy checkup",
      bloodPressure: "115/75",
      weight: "68 kg",
      heartRate: "78 bpm",
      previousVisit: "2024-12-30",
      allergies: "None",
      medications: "Prenatal vitamins",
    },
  ]);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = (id: number): void => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "confirmed" }
          : appointment
      )
    );
  };

  const handleCancel = (id: number): void => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "cancelled" }
          : appointment
      )
    );
  };

  const openAppointmentModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handlePrescribe = () => {
    // Add prescription logic here
    console.log("Prescribing medicine for:", selectedAppointment?.patientName);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Today's Appointments</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appointment) => (
          <Card
            key={appointment.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => openAppointmentModal(appointment)}
          >
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-gray-800">
                    {appointment.patientName}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    Age: {appointment.age}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{appointment.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{appointment.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{appointment.time}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-medium text-gray-700">Reason for Visit:</p>
                <p className="text-gray-600">{appointment.reason}</p>
              </div>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {appointment.status === "pending" ? (
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => handleConfirm(appointment.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Confirm
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : appointment.status === "confirmed" ? (
                  <Button variant="secondary" className="w-full" disabled>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Confirmed
                  </Button>
                ) : (
                  <Button variant="destructive" className="w-full" disabled>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelled
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedAppointment.patientName}
                    </p>
                    <p>
                      <span className="font-medium">Age:</span>{" "}
                      {selectedAppointment.age}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedAppointment.phone}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedAppointment.email}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Medical Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      <span>BP: {selectedAppointment.bloodPressure}</span>
                    </div>
                    <div className="flex items-center">
                      <Weight className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Weight: {selectedAppointment.weight}</span>
                    </div>
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-green-500" />
                      <span>Heart Rate: {selectedAppointment.heartRate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Medical History</h3>
                <p>
                  <span className="font-medium">Previous Visit:</span>{" "}
                  {selectedAppointment.previousVisit}
                </p>
                <p>
                  <span className="font-medium">Allergies:</span>{" "}
                  {selectedAppointment.allergies}
                </p>
                <p>
                  <span className="font-medium">Current Medications:</span>{" "}
                  {selectedAppointment.medications}
                </p>
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <Button onClick={handlePrescribe}>
                  <Pill className="h-4 w-4 mr-2" />
                  Prescribe Medicine
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DrAppointmentsContent;
