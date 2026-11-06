"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, MessageSquare, Clock, MapPin, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SITE_CONFIG } from "@/config/site";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Servicios", href: "#servicios" },
    { label: "Marcas", href: "#marcas" },
    { label: "Cotizá", href: "#cotiza" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" },
  ];

  const whatsappHref = `${SITE_CONFIG.business.contact.whatsappUrl}?text=${encodeURIComponent(
    "Hola KeyCar! Quisiera hacer una consulta de cerrajería automotriz."
  )}`;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Info Bar - Ultra compact & informative */}
      <div className="bg-[#0B1B2E] text-white text-xs border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-5 truncate">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-200">
              <Clock className="w-3.5 h-3.5 text-[#1473E6] flex-shrink-0" />
              <span>Atención 24 hs</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-300 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#1473E6] flex-shrink-0" />
              <span>{SITE_CONFIG.business.address.full}</span>
            </span>
            <span className="inline-flex sm:hidden items-center gap-1 text-slate-300 truncate">
              <MapPin className="w-3 h-3 text-[#1473E6] flex-shrink-0" />
              <span>Av. San Martín 1574, F. Varela</span>
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="tel:+5491178944996"
              className="text-slate-200 hover:text-white font-medium transition-colors"
            >
              11 7894-4996
            </a>
            <span className="text-slate-600 hidden md:inline">|</span>
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1473E6]" />
              <span>Acceso Gestión</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <div
        className={`w-full bg-white/95 backdrop-blur-md transition-all duration-200 border-b ${
          scrolled
            ? "border-[#E2E8F0] shadow-card py-2.5"
            : "border-[#E2E8F0]/80 py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <Logo variant="light" size="md" />

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-7"
            aria-label="Navegación principal"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#4A5568] hover:text-[#1473E6] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href="#cotiza"
              className="hidden xl:inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-[#0B1B2E] bg-[#F5F7FA] hover:bg-[#E2E8F0]/70 border border-[#E2E8F0] rounded-lg transition-colors"
            >
              Armá tu consulta
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#1473E6] hover:bg-[#0F5BB8] rounded-lg transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Escribinos por WhatsApp</span>
            </a>
          </div>

          {/* Mobile Actions: Quick Quote + Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href="#cotiza"
              className="inline-flex items-center justify-center px-3 py-2 text-xs font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8] rounded-lg transition-colors"
            >
              Cotizar
            </a>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              className="p-2 rounded-lg text-[#0B1B2E] hover:bg-[#F5F7FA] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1473E6]"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Compact 2-column grid for links to save vertical space */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-[#E2E8F0] px-3 pt-3 pb-4 shadow-lg">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-semibold text-[#0B1B2E] bg-[#F5F7FA] hover:bg-[#1473E6]/10 hover:text-[#1473E6] border border-[#E2E8F0]/70 transition-colors text-center"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-[#4A5568] bg-[#F5F7FA] hover:text-[#0B1B2E] border border-[#E2E8F0]/70 transition-colors text-center flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#1473E6]" />
                <span>Panel Admin</span>
              </Link>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8] rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Escribinos por WhatsApp (24 hs)</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

