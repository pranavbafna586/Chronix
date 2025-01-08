import { SendIcon } from "lucide-react";
import React from "react";

const Guide = () => {
  return (
    <section
      id="guide"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted flex items-center justify-center min-h-screen"
    >
      <div className="container px-4 md:px-6 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            Discover the simple steps to create and deliver professional
            certificates.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-background rounded-xl shadow-md p-6 space-y-4 group hover:bg-primary transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl group-hover:rounded-xl">
            <SendIcon className="text-primary h-8 w-8 group-hover:text-primary-foreground" />
            <h3 className="text-2xl font-bold group-hover:text-primary-foreground">
              Dashboard
            </h3>
            <p className="text-muted-foreground group-hover:text-primary-foreground">
              Track your certificates&apos; status, manage recipients, and view
              detailed reports.
            </p>
          </div>
          <div className="bg-background rounded-xl shadow-md p-6 space-y-4 group hover:bg-primary transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl group-hover:rounded-xl">
            <SendIcon className="text-primary h-8 w-8 group-hover:text-primary-foreground" />
            <h3 className="text-2xl font-bold group-hover:text-primary-foreground">
              Medical Records
            </h3>
            <p className="text-muted-foreground group-hover:text-primary-foreground">
              Safely store and manage medical certificates and records for easy
              access.
            </p>
          </div>
          <div className="bg-background rounded-xl shadow-md p-6 space-y-4 group hover:bg-primary transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl group-hover:rounded-xl">
            <SendIcon className="text-primary h-8 w-8 group-hover:text-primary-foreground" />
            <h3 className="text-2xl font-bold group-hover:text-primary-foreground">
              Community Section
            </h3>
            <p className="text-muted-foreground group-hover:text-primary-foreground">
              Connect with other users, share experiences, and collaborate on
              projects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guide;
