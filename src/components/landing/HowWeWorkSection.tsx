"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Cpu, FileCheck2, KeyRound } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

const STEP_ICONS = [MessageSquare, Cpu, FileCheck2, KeyRound];

export function HowWeWorkSection() {
  return (
    <section className="py-10 sm:py-16 bg-[#F5F7FA] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-7 sm:mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#1473E6] mb-1.5">
            Proceso Transparente
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B1B2E] tracking-tight">
            ¿Cómo trabajamos en KeyCar?
          </h2>
          <p className="text-xs sm:text-base text-[#4A5568] mt-1.5">
            Un flujo simple, rápido y sin vueltas desde que nos escribís hasta
            que te llevás tu llave probada.
          </p>
        </div>

        <div className="relative">
          {/* Animated connecting horizontal line on desktop */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-11 left-12 right-12 h-0.5 bg-[#E2E8F0] overflow-hidden"
          >
            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="h-full bg-[#1473E6]"
            />
          </div>

          {/* 2x2 Grid on Mobile to avoid excessive scrolling, 4 columns on Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 relative z-10">
            {SITE_CONFIG.howWeWork.map((item, idx) => {
              const Icon = STEP_ICONS[idx] || KeyRound;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 sm:p-5 shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#1473E6] text-white flex items-center justify-center shadow-sm">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="font-heading font-extrabold text-lg sm:text-2xl text-[#1473E6]/30">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-sm sm:text-lg text-[#0B1B2E] mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
