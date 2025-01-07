"use client"

import { LayoutDashboard, Calendar, UserRound, FileText, Brain, AlertTriangle, Target, Salad, Cloud, GraduationCap, Users, HomeIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { ContentKey } from './content'

const menuItems = [
  { icon: HomeIcon , label: "Home", key: "home" },
  { icon:LayoutDashboard, label: "Dashboard", key: "dashboard" },
  { icon: Calendar, label: "My Appointments", key: "appointments" },
  { icon: UserRound, label: "Doctors", key: "doctors" },
  { icon: FileText, label: "Reports", key: "reports" },
  { icon: Brain, label: "AI Diagnosis", key: "diagnosis" },
  { icon: AlertTriangle, label: "AI Risk Assessment", key: "risk" },
  { icon: Salad, label: "Diet Plan", key: "diet" },
  { icon: Cloud, label: "Weather and Health", key: "weather" },
  { icon: GraduationCap, label: "Health Education", key: "education" },
  { icon: Users, label: "Community Forum", key: "community" },
] as const

interface SidebarProps {
  activeContent: ContentKey
  setActiveContent: (key: ContentKey) => void
}

export function Sidebar({ activeContent, setActiveContent }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-50 h-screen fixed left-0 top-20 overflow-y-auto">
      <nav className="space-y-1 p-4">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveContent(item.key)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors",
              activeContent === item.key && "bg-blue-50 text-blue-600"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

