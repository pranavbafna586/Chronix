"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { contentComponents, type ContentKey } from "@/components/content";
import {
  LayoutDashboard,
  Calendar,
  HomeIcon,
  PillBottleIcon,
} from "lucide-react";

export default function Home() {
  const [activeContent, setActiveContent] = useState<ContentKey>("home");
  const ContentComponent = contentComponents[activeContent];

  const menuItems2: {
    icon: React.ElementType;
    label: string;
    key: ContentKey;
  }[] = [
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
    { icon: Calendar, label: "DrAppointments", key: "drappointments" },
    { icon: PillBottleIcon, label: "Prescription", key: "prescription" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex pt-16">
        <Sidebar
          activeContent={activeContent}
          setActiveContent={setActiveContent}
          menuItems={menuItems2}
        />
        <main className="flex-1 p-8 ml-64">
          <ContentComponent />
        </main>
      </div>
    </div>
  );
}
