import {
  BadgeIcon,
  ImportIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  PrinterIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const Features = () => {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center min-h-screen"
    >
      <div className="container px-4 md:px-6 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            Explore the powerful features that elevate your Chronix experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-background rounded-xl shadow-md p-6 space-y-4 group hover:bg-primary transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
            <BadgeIcon className="text-primary h-8 w-8 group-hover:text-primary-foreground" />
            <h3 className="text-2xl font-bold group-hover:text-primary-foreground">
              Disease Diagnosis
            </h3>
            <p className="text-muted-foreground group-hover:text-primary-foreground">
              Leverage advanced algorithms to diagnose a wide range of diseases, ensuring accurate and quick results.
            </p>
          </div>
          <Link href="/appointment">
          <div className="bg-background rounded-xl shadow-md p-6 space-y-4 group hover:bg-primary transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
            <PrinterIcon className="text-primary h-8 w-8 group-hover:text-primary-foreground" />
            <h3 className="text-2xl font-bold group-hover:text-primary-foreground">
              Book Appointment
            </h3>
            <p className="text-muted-foreground group-hover:text-primary-foreground">
              Schedule appointments with Chronix professionals with ease, directly through the platform.
            </p>
          </div>
          </Link>
          <div className="bg-background rounded-xl shadow-md p-6 space-y-4 group hover:bg-primary transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
            <MailIcon className="text-primary h-8 w-8 group-hover:text-primary-foreground" />
            <h3 className="text-2xl font-bold group-hover:text-primary-foreground">
              Medical Records
            </h3>
            <p className="text-muted-foreground group-hover:text-primary-foreground">
              Safely store and access all your medical records in one place for easy reference and tracking.
            </p>
          </div>
          <div className="bg-background rounded-xl shadow-md p-6 space-y-4 group hover:bg-primary transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
            <InfoIcon className="text-primary h-8 w-8 group-hover:text-primary-foreground" />
            <h3 className="text-2xl font-bold group-hover:text-primary-foreground">
              Diet Plan
            </h3>
            <p className="text-muted-foreground group-hover:text-primary-foreground">
              Receive personalized diet plans tailored to your health needs, helping you achieve your wellness goals.
            </p>
          </div>
          <div className="bg-background rounded-xl shadow-md p-6 space-y-4 group hover:bg-primary transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
            <ImportIcon className="text-primary h-8 w-8 group-hover:text-primary-foreground" />
            <h3 className="text-2xl font-bold group-hover:text-primary-foreground">
              Community Section
            </h3>
            <p className="text-muted-foreground group-hover:text-primary-foreground">
              Join a supportive community where you can share experiences, advice, and knowledge with others.
            </p>
          </div>
          <div className="bg-background rounded-xl shadow-md p-6 space-y-4 group hover:bg-primary transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
            <LockIcon className="text-primary h-8 w-8 group-hover:text-primary-foreground" />
            <h3 className="text-2xl font-bold group-hover:text-primary-foreground">
              Pharmacy Section
            </h3>
            <p className="text-muted-foreground group-hover:text-primary-foreground">
              Order medications and health products directly from trusted pharmacies through the platform.
            </p>
          </div>
        </div>
      </div>
    </section>

  );
};

export default Features;
