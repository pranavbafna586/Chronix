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
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 shadow-lg overflow-y-auto">
      <nav className="p-3 pt-6 space-y-1"> {/* Added pt-6 for extra top padding */}
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveContent(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
              activeContent === item.key
              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
              : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800'
            }`}
          >
            <item.icon className={`w-5 h-5 ${
              activeContent === item.key
              ? 'text-white'
              : 'text-blue-500'
            }`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
