"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function FloatingWhatsApp() {
  const href = `${SITE_CONFIG.business.contact.whatsappUrl}?text=${encodeURIComponent(
    "Hola KeyCar! Te escribo desde la página web para hacer una consulta."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp a KeyCar (Atención 24 hs)"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1FAF54] text-white font-heading font-bold text-xs sm:text-sm px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-cardHover transition-colors animate-whatsapp-pulse focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
    >
      <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
      <span className="hidden sm:inline">WhatsApp 24 hs</span>
      <span className="sm:hidden">24 hs</span>
    </a>
  );
}

