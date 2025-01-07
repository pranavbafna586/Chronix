import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-background py-6 border-t">
      <div className="container px-4 md:px-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          &copy; 2024 Chronix. All rights reserved.
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="group inline-flex h-9 items-center justify-center rounded-full bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            prefetch={false}
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="group inline-flex h-9 items-center justify-center rounded-full bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="group inline-flex h-9 items-center justify-center rounded-full bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            prefetch={false}
          >
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
