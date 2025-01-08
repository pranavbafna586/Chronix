import React from "react";
import { ParallaxScrollDemo } from "@/components/ui/parallaxScrollDemo";

const Review = () => {
  return (
    <section
      id="support"
      className="w-full py-6 md:py-12 lg:py-16 bg-muted flex justify-center items-center"
    >
      <div className="container px-4 md:px-6">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            Hear from Chronix professionals and organizations that trust our
            platform for efficient health management.
          </p>
        </div>
        <ParallaxScrollDemo />
      </div>
    </section>
  );
};

export default Review;
