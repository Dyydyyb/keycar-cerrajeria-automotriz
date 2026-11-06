"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  KeyRound,
  Radio,
  Cpu,
  Wrench,
  Lock,
  PanelTop,
  ShieldAlert,
  Check,
  ArrowRight,
  Clock,
} from "lucide-react";
import { SITE_CONFIG, ServiceCatalogItem } from "@/config/site";

const ICON_MAP = {
  KeyRound,
  Radio,
  Cpu,
  Wrench,
  Lock,
  PanelTop,
  ShieldAlert,
};

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const handleConsultClick = (service: ServiceCatalogItem) => {
    onSelectService(service.title);
    const el = document.getElementById("cotiza");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="servicios"
      className="py-10 sm:py-16 lg:py-20 bg-[#F5F7FA] border-b border-[#E2E8F0]"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-7 sm:mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#1473E6] mb-2">
            Nuestros Servicios Especializados
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B1B2E] tracking-tight">
            Soluciones integrales en cerrajería automotriz
          </h2>
          <p className="text-sm sm:text-base text-[#4A5568] mt-2 leading-relaxed">
            Desde una copia preventiva con chip hasta la recuperación total ante
            pérdida de llaves o fallas en cierre centralizado y alzacristales.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {SITE_CONFIG.services.map((service, idx) => {
            const IconComponent = ICON_MAP[service.iconName] || KeyRound;
            const isEmergency = service.isEmergency;

            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className={`group relative bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-6 shadow-card hover:shadow-cardHover hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  isEmergency ? "md:col-span-2 lg:col-span-3 bg-white" : ""
                }`}
              >
                {/* Top Accent Line on Hover (always visible on Emergency card) */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-[#1473E6] transition-transform duration-300 origin-left ${
                    isEmergency
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />

                <div
                  className={
                    isEmergency
                      ? "grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center"
                      : ""
                  }
                >
                  <div className={isEmergency ? "lg:col-span-5" : ""}>
                    {/* Header: Icon + Title + Slogan */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-colors ${
                          isEmergency
                            ? "bg-[#0B1B2E] text-white border-[#0B1B2E]"
                            : "bg-[#F5F7FA] text-[#1473E6] border-[#E2E8F0] group-hover:bg-[#1473E6] group-hover:text-white group-hover:border-[#1473E6]"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <h3 className="font-heading font-bold text-base sm:text-lg text-[#0B1B2E] leading-snug">
                            {service.title}
                          </h3>
                          {isEmergency && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0B1B2E] text-white">
                              <Clock className="w-3 h-3 text-[#1473E6]" />
                              Urgencias 24 hs
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-[#1473E6] mt-0.5">
                          “{service.slogan}”
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed mb-3.5">
                      {service.description}
                    </p>
                  </div>

                  {/* Checklist (2 columns on emergency card or compact list on normal cards) */}
                  <div className={isEmergency ? "lg:col-span-5" : ""}>
                    <ul
                      className={`grid gap-1.5 sm:gap-2 mb-4 ${
                        isEmergency
                          ? "grid-cols-1 sm:grid-cols-2"
                          : "grid-cols-1"
                      }`}
                    >
                      {service.checklist.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs sm:text-[13px] text-[#0B1B2E]"
                        >
                          <span className="w-4 h-4 rounded-full bg-[#1473E6]/10 text-[#1473E6] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div
                    className={
                      isEmergency
                        ? "lg:col-span-2 flex lg:justify-end"
                        : "pt-3 border-t border-[#E2E8F0] mt-auto"
                    }
                  >
                    <button
                      type="button"
                      onClick={() => handleConsultClick(service)}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                        isEmergency
                          ? "bg-[#1473E6] hover:bg-[#0F5BB8] text-white py-3"
                          : "bg-[#F5F7FA] hover:bg-[#1473E6] text-[#0B1B2E] hover:text-white border border-[#E2E8F0] hover:border-[#1473E6]"
                      }`}
                    >
                      <span>Consultar</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

