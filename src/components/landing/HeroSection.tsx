"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  CarFront,
  Cpu,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Radio,
  KeyRound,
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function HeroSection() {
  const whatsappHref = `${SITE_CONFIG.business.contact.whatsappUrl}?text=${encodeURIComponent(
    "Hola KeyCar! Necesito consultar por un servicio de cerrajería automotriz."
  )}`;

  const trustBadges = [
    {
      icon: Clock,
      title: "Atención 24 hs",
      subtitle: "Urgencias y taller",
    },
    {
      icon: CarFront,
      title: "Todas las marcas",
      subtitle: "Nacionales e importados",
    },
    {
      icon: Cpu,
      title: "Equipos de última generación",
      subtitle: "Alta precisión electrónica",
    },
  ];

  return (
    <section className="relative bg-white overflow-hidden border-b border-[#E2E8F0]">
      {/* Subtle geometric background shapes (strictly sober, matte light blue/gray) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-[#F5F7FA] border border-[#E2E8F0]/70" />
        <div className="absolute top-16 right-12 w-[300px] h-[300px] rounded-full bg-[#1473E6]/[0.03] border border-[#1473E6]/10" />
        <div className="absolute -bottom-20 -left-20 w-[360px] h-[360px] rounded-3xl rotate-12 bg-[#F5F7FA]/80 border border-[#E2E8F0]/60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Text, CTAs & Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            {/* Location & Category Pill */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F7FA] border border-[#E2E8F0] mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1473E6] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                Florencio Varela
              </span>
              <span className="text-[#E2E8F0]">•</span>
              <span className="text-xs font-medium text-[#4A5568]">
                Av. Gral. San Martín 1574
              </span>
            </div>

            {/* Main Brand Heading */}
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-[54px] text-[#0B1B2E] tracking-tight leading-[1.1] mb-3 sm:mb-4">
              Tu llave,{" "}
              <span className="text-[#1473E6]">nuestro trabajo.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-[#4A5568] leading-relaxed max-w-2xl mb-5 sm:mb-7">
              Especialistas en llaves automotrices en Florencio Varela.{" "}
              <strong className="font-semibold text-[#0B1B2E]">
                Calidad, rapidez y confianza, las 24 hs.
              </strong>{" "}
              Copias con chip, programación de telemandos, clonación de
              transponder y urgencias por pérdida total.
            </p>

            {/* Primary & Secondary CTAs (Side by side even on mobile to save vertical space) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3.5 mb-6 sm:mb-8">
              <a
                href="#cotiza"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8] rounded-xl transition-all shadow-card hover:shadow-cardHover"
              >
                <span>Pedí tu presupuesto</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 text-sm sm:text-base font-bold text-[#0B1B2E] bg-white hover:bg-[#F5F7FA] border-2 border-[#E2E8F0] hover:border-[#0B1B2E]/30 rounded-xl transition-all"
              >
                <MessageSquare className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                <span>WhatsApp 24 hs</span>
              </a>
            </div>

            {/* 3 Trust Badges - Compact 3-column horizontal layout on mobile & desktop */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.title}
                    className="bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center flex-shrink-0 text-[#1473E6]">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-[#0B1B2E] leading-tight">
                        {badge.title}
                      </p>
                      <p className="text-[11px] text-[#4A5568] hidden sm:block truncate mt-0.5">
                        {badge.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Automotive Key & Diagnostic Visual Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <div className="relative bg-[#F5F7FA] border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-card">
              {/* Top Diagnostic Header */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1473E6]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0B1B2E]">
                    Diagnóstico y Programación Digital
                  </span>
                </div>
                <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-white text-[#1473E6] border border-[#E2E8F0] rounded-full">
                  OBD2 · Transponder
                </span>
              </div>

              {/* Center Visual Composition: Brand Emblem + Smart Key Vector Specs */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#0B1B2E] border border-[#E2E8F0] flex-shrink-0 shadow-sm">
                    <Image
                      src="/logo.png"
                      alt="Logo Oficial KeyCar Cerrajería Automotriz"
                      fill
                      sizes="96px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1473E6] mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Cerrajería Automotriz</span>
                    </div>
                    <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#0B1B2E] leading-snug">
                      Key<span className="text-[#1473E6]">Car</span> Florencio Varela
                    </h2>
                    <p className="text-xs text-[#4A5568] mt-1 leading-relaxed">
                      Llaves codificadas, telemandos originales y alternativos,
                      cierre centralizado y alzacristales.
                    </p>
                  </div>
                </div>

                {/* Technical Specs Strip (2x2 compact grid) */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#E2E8F0]">
                  <div className="flex items-center gap-2 bg-[#F5F7FA] px-3 py-2 rounded-lg border border-[#E2E8F0]/70">
                    <KeyRound className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#4A5568] leading-none">
                        Llaves con Chip
                      </p>
                      <p className="text-xs font-bold text-[#0B1B2E] truncate mt-0.5">
                        ID46 · ID48 · MQB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#F5F7FA] px-3 py-2 rounded-lg border border-[#E2E8F0]/70">
                    <Radio className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#4A5568] leading-none">
                        Telemandos
                      </p>
                      <p className="text-xs font-bold text-[#0B1B2E] truncate mt-0.5">
                        315 / 433.92 MHz
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Highlights List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  "Copias y duplicados en el acto",
                  "Servicio Cero Llaves 24 hs",
                  "Reparación de carcasas y botones",
                  "Cierre centralizado y alzacristales",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-[#E2E8F0]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1473E6] flex-shrink-0" />
                    <span className="font-medium text-[#0B1B2E] truncate">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

