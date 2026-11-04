"use client";

import React from "react";
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Instagram,
  Facebook,
  ExternalLink,
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function ContactSection() {
  const { address, contact } = SITE_CONFIG.business;

  return (
    <section
      id="contacto"
      className="py-10 sm:py-16 lg:py-20 bg-white border-b border-[#E2E8F0]"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-7 sm:mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#1473E6] mb-1.5">
            Contacto y Ubicación
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B1B2E] tracking-tight">
            Encontranos en Florencio Varela
          </h2>
          <p className="text-xs sm:text-base text-[#4A5568] mt-1.5">
            Atendemos en nuestro taller sobre Av. Gral. San Martín y asistimos
            urgencias de cerrajería automotriz las 24 hs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Contact Details Cards (5 cols on desktop, compact 2-col grid on mobile) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-4">
            {/* Address & Schedule Card */}
            <div className="bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl p-4 sm:p-5">
              <div className="flex items-start gap-3.5 mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#1473E6] text-white flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
                    Dirección del Taller
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A5568] mt-0.5">
                    {address.full}
                  </p>
                  <a
                    href={address.googleMapsDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1473E6] hover:underline mt-1.5"
                  >
                    <span>Cómo llegar con Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-3.5 border-t border-[#E2E8F0]">
                <div className="w-10 h-10 rounded-xl bg-[#0B1B2E] text-white flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#1473E6]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
                    Horario de Atención
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#1473E6]">
                    Atención las 24 hs (Urgencias y Taller)
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp & Phones Grid (2 columns on mobile to avoid vertical sprawl) */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`${contact.whatsappUrl}?text=${encodeURIComponent(
                  "Hola KeyCar! Te escribo desde la web por una consulta."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F5F7FA] hover:bg-white border border-[#E2E8F0] hover:border-[#1473E6] rounded-xl p-3.5 sm:p-4 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#1473E6] text-white flex items-center justify-center mb-2">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-semibold text-[#4A5568]">
                  WhatsApp Principal
                </p>
                <p className="font-heading font-bold text-xs sm:text-sm text-[#0B1B2E] group-hover:text-[#1473E6] mt-0.5">
                  {contact.whatsappDisplay}
                </p>
              </a>

              <a
                href="tel:+5492213638369"
                className="bg-[#F5F7FA] hover:bg-white border border-[#E2E8F0] hover:border-[#1473E6] rounded-xl p-3.5 sm:p-4 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-[#E2E8F0] text-[#1473E6] flex items-center justify-center mb-2">
                  <Phone className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-semibold text-[#4A5568]">
                  Teléfono Adicional
                </p>
                <p className="font-heading font-bold text-xs sm:text-sm text-[#0B1B2E] group-hover:text-[#1473E6] mt-0.5">
                  221 363-8369
                </p>
              </a>
            </div>

            {/* Social Media Links (2 columns on mobile) */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={contact.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F5F7FA] hover:bg-white border border-[#E2E8F0] hover:border-[#1473E6] rounded-xl p-3.5 flex items-center gap-2.5 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] text-[#1473E6] flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-[#4A5568]">
                    Instagram
                  </p>
                  <p className="text-xs font-bold text-[#0B1B2E] truncate">
                    {contact.instagram.handle}
                  </p>
                </div>
              </a>

              <a
                href={contact.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F5F7FA] hover:bg-white border border-[#E2E8F0] hover:border-[#1473E6] rounded-xl p-3.5 flex items-center gap-2.5 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] text-[#1473E6] flex items-center justify-center flex-shrink-0">
                  <Facebook className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-[#4A5568]">
                    Facebook
                  </p>
                  <p className="text-xs font-bold text-[#0B1B2E] truncate">
                    {contact.facebook.handle}
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Embedded Google Map (7 cols on desktop) */}
          <div className="lg:col-span-7 bg-[#F5F7FA] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-card min-h-[260px] sm:min-h-[360px] flex flex-col">
            <iframe
              title="Ubicación de KeyCar en Av. Gral. San Martín 1574, Florencio Varela"
              src={address.googleMapsEmbedUrl}
              className="w-full flex-1 min-h-[260px] sm:min-h-[360px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
