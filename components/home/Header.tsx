import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import { BadgeIcon, DollarSign, BookOpen, HelpCircle, Layout, Menu, X, User } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react"; // Import the required icons
import { LayoutDashboard as Dashboard } from "lucide-react"; // Import the Dashboard icon with alias

type IconName = keyof typeof Icons;

const NavItems = [
  { title: "Home", href: "/home", icon: "Template" },
  { title: "Features", href: "#features", icon: "Feature" },
  { title: "Guide", href: "#guide", icon: "Book" },
  { title: "Pricing", href: "#pricing", icon: "Dollar" },
  { title: "Feedback", href: "#support", icon: "HelpCircle" },
];

const Icons = {
  Feature: Layout,
  Dollar: DollarSign,
  Template: BadgeIcon,
  Book: BookOpen,
  HelpCircle: HelpCircle,
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Add dropdown state

  return (
    <header className="fixed top-4 z-50 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-90 px-4 lg:px-6 h-14 flex items-center shadow-sm rounded-full w-11/12 max-w-5xl">
      <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
        <BadgeIcon className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold text-white">Health Care</span>
      </Link>


      <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
        <NavigationMenu>
          <NavigationMenuList>
            {NavItems.map((item, index) => {
              const Icon = Icons[item.icon as IconName];
              return (
                <NavigationMenuLink key={index} asChild>
                  <Link
                    href={item.href}
                    className="group inline-flex h-9 items-center justify-center rounded-full bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-white/20 data-[state=open]:bg-white/20"
                    prefetch={false}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <div className="ml-auto md:hidden">
        <Button
          onClick={() => setMenuOpen(!menuOpen)}
          variant="ghost"
          size="icon"
          className="text-white"
        >
          {menuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      <div className="relative">
        <Button
          onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
          className="hidden md:inline-flex ml-4 group h-9 items-center justify-center rounded-full bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <User className="mr-2 h-5 w-5" />
          Profile
        </Button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-gray-900 rounded-lg shadow-lg w-48 p-2">
            <Link
              href="/dashboard"
              className="flex items-center text-sm text-white px-4 py-2 hover:bg-white/10 rounded-md"
              onClick={() => setDropdownOpen(false)} // Close dropdown on click
            >
              <Dashboard className="mr-2 h-5 w-5" /> {/* Dashboard icon */}
              Dashboard
            </Link>
            <Link
              href="/logout"
              className="flex items-center text-sm text-red-600 px-4 py-2 hover:bg-white/10 rounded-md"
              onClick={() => setDropdownOpen(false)} // Close dropdown on click
            >
              <LogOut className="mr-2 h-5 w-5" /> {/* Logout icon */}
              Logout
            </Link>
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 shadow-lg rounded-lg p-4 md:hidden">
          {NavItems.map((item, index) => {
            const Icon = Icons[item.icon as IconName];
            return (
              <Link
                key={index}
                href={item.href}
                className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {item.title}
              </Link>
            );
          })}
          <Link href="/signup" passHref>
            <Button className="w-full mt-4 group h-9 items-center justify-center rounded-full bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
