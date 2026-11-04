"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { BrandsSlider } from "@/components/landing/BrandsSlider";
import { QuoteBuilder } from "@/components/landing/QuoteBuilder";
import { HowWeWorkSection } from "@/components/landing/HowWeWorkSection";
import { WhyChooseUsSection } from "@/components/landing/WhyChooseUsSection";
import { ComingSoonBanner } from "@/components/landing/ComingSoonBanner";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";

export default function LandingPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#4A5568] overflow-x-hidden">
      {/* A) Sticky Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* B) Hero Section */}
        <HeroSection />

        {/* C) 7 Official Services Grid */}
        <ServicesSection
          onSelectService={(srvTitle) => {
            setSelectedService(srvTitle);
          }}
        />

        {/* D) 16 Brands Infinite Marquee Slider */}
        <BrandsSlider
          onSelectBrand={(brandName) => {
            setSelectedBrand(brandName);
          }}
        />

        {/* E) 4-Step Interactive Quote Builder ("Armá tu consulta") */}
        <QuoteBuilder
          preselectedService={selectedService}
          preselectedBrand={selectedBrand}
        />

        {/* F) How We Work (4-step Timeline) */}
        <HowWeWorkSection />

        {/* G) Why Choose Us (Animated Counters + Calidad / Rapidez / Confianza) */}
        <WhyChooseUsSection />

        {/* H) Coming Soon ("Llaves para el hogar. ¡Próximamente!") */}
        <ComingSoonBanner />

        {/* I) Contact & Location (Google Maps + Phones + Socials) */}
        <ContactSection />
      </main>

      {/* J) Dark Blue Footer (#0B1B2E) */}
      <Footer />

      {/* K) Matte Floating WhatsApp Button (#25D366) */}
      <FloatingWhatsApp />
    </div>
  );
}
