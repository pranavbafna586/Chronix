"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Guide from "@/components/home/Guide";
import Pricing from "@/components/home/Pricing";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";

export default function Landing() {
  const [isSignedUp] = useState(false);
  const router = useRouter();

  const handleSectionClick = (section: string) => {
    if (!isSignedUp) {
      router.push("/sign-in");
    } else {
      router.push(section);
    }
  };

  return (
    <>
      <Header />
      <div onClick={() => handleSectionClick("/hero")}>
        <Hero />
      </div>
      <div onClick={() => handleSectionClick("/features")}>
        <Features />
      </div>
      <div onClick={() => handleSectionClick("/guide")}>
        <Guide />
      </div>
      <div onClick={() => handleSectionClick("/pricing")}>
        <Pricing />
      </div>
      <Footer />
    </>
  );
}
