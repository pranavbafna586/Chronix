import Home from "@/app/(main)/(routes)/home/page"
import { AppointmentsContent } from "./appointments-content"
import { DashboardContent } from "./dashboard-content"
import { DoctorsContent } from "./doctors-content"
import { HomeContent } from "./home-content"

export const contentComponents = {
  home: HomeContent,
  dashboard: DashboardContent,
  appointments: AppointmentsContent,
  doctors: DoctorsContent,
  reports: () => <div className="text-2xl font-bold">Reports</div>,
  diagnosis: () => <div className="text-2xl font-bold">AI Diagnosis</div>,
  risk: () => <div className="text-2xl font-bold">AI Risk Assessment</div>,
  goals: () => <div className="text-2xl font-bold">Personal Goals</div>,
  prakriti: () => <div className="text-2xl font-bold">Prakriti</div>,
  diet: () => <div className="text-2xl font-bold">Diet Plan</div>,
  weather: () => <div className="text-2xl font-bold">Weather and Health</div>,
  education: () => <div className="text-2xl font-bold">Health Education</div>,
  community: () => <div className="text-2xl font-bold">Community Forum</div>,
}

export type ContentKey = keyof typeof contentComponents

