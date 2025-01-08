"use client";
import { cn } from "@/lib/utils";
import { ContentKey } from "./content";

interface SidebarProps {
  activeContent: ContentKey;
  setActiveContent: (key: ContentKey) => void;
  menuItems: {
    icon: React.ElementType;
    label: string;
    key: ContentKey;
  }[];
}

export function Sidebar({
  activeContent,
  setActiveContent,
  menuItems,
}: SidebarProps) {
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
  );
}
