import Home from "@/app/(main)/(routes)/home/page";
import { AppointmentsContent } from "./appointments-content";
import DashboardContent from "./dashboard-content";
import { DoctorsContent } from "./doctors-content";
import { HomeContent } from "./home-content";
import ReportsContent from "./reports-content";
import EducationContent from "./education-content";
import  {labContent}  from "./lab-content";
export const contentComponents = {
  home: HomeContent,
  dashboard: DashboardContent,
  appointments: AppointmentsContent,
  doctors: DoctorsContent,
  reports: ReportsContent,
  lab: labContent,
  risk: () => <div className="text-2xl font-bold">AI Risk Assessment</div>,
  goals: () => <div className="text-2xl font-bold">Personal Goals</div>,
  diet: () => <div className="text-2xl font-bold">Diet Plan</div>,
  weather: () => <div className="text-2xl font-bold">Weather and Health</div>,
  education: EducationContent,
  community: () => <div className="text-2xl font-bold">Community Forum</div>,
};

export type ContentKey = keyof typeof contentComponents;
