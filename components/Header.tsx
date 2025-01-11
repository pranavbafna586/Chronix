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
    <header className="border-b fixed top-0 left-0 right-0 bg-white z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Chronix
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/explore" className="text-gray-600 hover:text-blue-600">
              Explore plans
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">
              Contact Us
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
            <Medal className="w-5 h-5 text-yellow-500" />
            <span className="font-medium text-gray-700">{score} points</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full bg-gray-100 p-2">
                <span className="sr-only">Open user menu</span>
                <User className="h-8 w-8 text-gray-600" />{" "}
                {/* Replaced blue circle with User icon */}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
