"use client";
import React from "react";
// import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Guide from "@/components/home/Guide";
import Pricing from "@/components/home/Pricing";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
// import Footer from "@/components/layout/Footer";

export default function Landing() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Guide />
      <Pricing />
      <Footer />
    </>
  );
}
