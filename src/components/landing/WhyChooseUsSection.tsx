"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Zap, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { useKeyCar } from "@/context/KeyCarContext";

const VALUE_ICONS = [Award, Zap, ShieldCheck];

function AnimatedNumber({
  target,
  prefix = "",
  suffix = "",
}: {
  target: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTimestamp: number | null = null;
    const duration = 1100;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    window.requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("es-AR")}
      {suffix}
    </span>
  );
}

export function WhyChooseUsSection() {
  const { db } = useKeyCar();

  // Read editable numbers from live settings (falling back to SITE_CONFIG.stats)
  const dynamicStats = [
    {
      ...SITE_CONFIG.stats[0],
      value: db.settings.statKeysDone || SITE_CONFIG.stats[0].value,
    },
    {
      ...SITE_CONFIG.stats[1],
      value: db.settings.statHours || SITE_CONFIG.stats[1].value,
    },
    {
      ...SITE_CONFIG.stats[2],
      value: db.settings.statBrands || SITE_CONFIG.stats[2].value,
    },
    SITE_CONFIG.stats[3],
  ];

  return (
    <section
      id="nosotros"
      className="py-10 sm:py-16 lg:py-20 bg-white border-b border-[#E2E8F0]"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-7 sm:mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#1473E6] mb-1.5">
            Por Qué Elegirnos
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B1B2E] tracking-tight">
            Calidad, rapidez y confianza en cada trabajo
          </h2>
          <p className="text-xs sm:text-base text-[#4A5568] mt-1.5">
            Nos especializamos exclusivamente en cerrajería y electrónica
            automotriz en Florencio Varela, cuidando tu vehículo con
            herramientas de diagnóstico dedicadas.
          </p>
        </div>

        {/* Animated Counters (2x2 on mobile, 4 columns on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8 sm:mb-12">
          {dynamicStats.map((stat) => (
            <div
              key={stat.id}
              className="bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl p-4 sm:p-6 shadow-sm"
            >
              <p className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1473E6] tracking-tight">
                <AnimatedNumber
                  target={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </p>
              <p className="font-heading font-bold text-xs sm:text-base text-[#0B1B2E] mt-1">
                {stat.label}
              </p>
              <p className="text-[11px] sm:text-xs text-[#4A5568] mt-0.5 leading-snug">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* 3 Core Values: Calidad / Rapidez / Confianza */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {SITE_CONFIG.business.values.map((val, idx) => {
            const Icon = VALUE_ICONS[idx] || ShieldCheck;
            return (
              <motion.div
                key={val.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-6 shadow-card flex items-start gap-3.5"
              >
                <div className="w-11 h-11 rounded-xl bg-[#0B1B2E] text-white flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#1473E6]" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#0B1B2E] mb-1">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

