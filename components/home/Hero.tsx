import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThreeDCard from "./ThreeDCard";

const Hero = () => {
  return (
    <section className="min-h-screen w-full md:p-16 bg-gradient-to-r from-primary to-primary-foreground">
      <div className="container my-16 px-4 md:px-6 flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Left Content */}
        <div className="space-y-4 md:w-1/2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Your Trusted Partner in Chronix Solutions
          </h1>
          <p className="text-xl text-white/80">
            Explore innovative tools to streamline patient care, enhance medical
            workflows, and improve health outcomes with our advanced platform.
          </p>
          <div className="flex gap-4">
            <Link type="button" href="/sign-up">
              <Button className="rounded-full">Get Started</Button>
            </Link>
            <Button className="rounded-full" variant="secondary">
              Learn More
            </Button>
          </div>
        </div>
        <ThreeDCard />
      </div>
    </section>
  );
};
export default Hero;
