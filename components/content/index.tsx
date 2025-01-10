import Home from "@/app/(main)/(routes)/home/page";
import { AppointmentsContent } from "./appointments-content";
import DashboardContent from "./dashboard-content";
import { DoctorsContent } from "./doctors-content";
import { HomeContent } from "./home-content";
import ReportsContent from "./reports-content";
import EducationContent from "./education-content";
import { labContent } from "./lab-content";
import DietPlanPage from "./diet-content";
import { prescriptionContent } from "./prescription-content";
import MentalHealthPage from "./mentalhealth-content";
import RiskAssessment from "./risk-content";
import { DrAppointmentsContent } from "./dr-appointments-content";
import  communityContent  from "./community-content";
export const contentComponents = {
  home: HomeContent,
  dashboard: DashboardContent,
  appointments: AppointmentsContent,
  doctors: DoctorsContent,
  reports: ReportsContent,
  lab: labContent,
  risk: RiskAssessment,
  diet: DietPlanPage,
  mentalhealth: MentalHealthPage,
  prescription: prescriptionContent,
  education: EducationContent,
  community: communityContent,
  drappointments: DrAppointmentsContent,
};

export type ContentKey = keyof typeof contentComponents;
