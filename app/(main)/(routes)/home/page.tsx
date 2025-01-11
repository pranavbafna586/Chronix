"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { contentComponents, type ContentKey } from "@/components/content";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Brain,
  AlertTriangle,
  Target,
  Salad,
  Cloud,
  GraduationCap,
  Users,
  HomeIcon,
  TestTube,
  PillBottleIcon,
  PhoneCall,
} from "lucide-react";
import { DropdownMenuRadioGroup } from "@radix-ui/react-dropdown-menu";

export default function Home() {
  const [activeContent, setActiveContent] = useState<ContentKey | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as ContentKey;
    setActiveContent(hash || "home");
  }, []);

  useEffect(() => {
    if (activeContent) {
      window.location.hash = activeContent;
    }
  }, [activeContent]);

  if (!activeContent) {
    return null; // or a loading spinner
  }

  const ContentComponent = contentComponents[activeContent];
  const menuItems1: {
    icon: React.ElementType;
    label: string;
    key: ContentKey;
  }[] = [
    { icon: HomeIcon, label: "Home", key: "home" },
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
    { icon: Calendar, label: "My Appointments", key: "appointments" },
    { icon: FileText, label: "Reports", key: "reports" },
    { icon: TestTube, label: "Lab Tests", key: "lab" },
    { icon: AlertTriangle, label: "AI Risk Assessment", key: "risk" },
    { icon: PhoneCall, label: "Ai Companion", key: "aichat" },
    { icon: Salad, label: "Diet Plan", key: "diet" },
    { icon: Brain, label: "Mental Health", key: "mentalhealth" },
    { icon: Cloud, label: "Progress Board", key: "kanban" },
    { icon: GraduationCap, label: "Health Education", key: "education" },
    { icon: Users, label: "Community Forum", key: "community" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex pt-16">
        <Sidebar
          activeContent={activeContent}
          setActiveContent={setActiveContent}
          menuItems={menuItems1}
        />
        <main className="flex-1 p-8 ml-64">
          <ContentComponent />
        </main>
      </div>
    </div>
  );
}
