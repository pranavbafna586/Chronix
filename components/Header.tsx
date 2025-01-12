"use client";

import Link from "next/link";
import { User, Settings, LogOut, Medal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  score: number;
}

export function Header({ score }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900/80 z-10">
      <div className="flex items-center justify-between px-8 py-4 max-w-[2000px] mx-auto">
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Chronix
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/explore"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Explore plans
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Contact Us
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 px-4 py-2 rounded-full border border-yellow-100 dark:border-yellow-800">
            <Medal className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {score} points
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <span className="sr-only">Open user menu</span>
                <User className="h-8 w-8 text-gray-600 dark:text-gray-300" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 p-1">
              <DropdownMenuItem className="flex items-center px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors duration-200">
                <User className="mr-2 h-4 w-4 text-blue-500" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors duration-200">
                <Settings className="mr-2 h-4 w-4 text-blue-500" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer transition-colors duration-200">
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                <span className="text-red-600 dark:text-red-400">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
