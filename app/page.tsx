"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import WhyChoose from "@/components/sections/WhyChoose";
import Stats from "@/components/sections/Stats";
import Portfolio from "@/components/sections/Portofolios";
import BestSeller from "@/components/sections/BestSeller";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

const PamaStudio: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF7F1] text-[#1a0505]">
      <Navbar />
      <Hero />
      <WhyChoose />
      <Stats />
      <Portfolio />
      <BestSeller />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default PamaStudio;