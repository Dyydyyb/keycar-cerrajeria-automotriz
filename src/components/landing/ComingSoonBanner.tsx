"use client";

import React, { useState } from "react";
import { Home, Bell, CheckCircle2 } from "lucide-react";
import { useKeyCar } from "@/context/KeyCarContext";

export function ComingSoonBanner() {
  const { addWaitlistContact } = useKeyCar();
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    addWaitlistContact(contact);
    setSubmitted(true);
    setContact("");
  };

  return (
    <section className="py-8 sm:py-12 bg-[#F5F7FA] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-[#0B1B2E] rounded-2xl p-5 sm:p-8 lg:p-10 text-white border border-[#E2E8F0]/20 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#1473E6] uppercase tracking-wider mb-2.5">
                <Home className="w-3.5 h-3.5 text-[#1473E6]" />
                <span>Expansión de Servicios KeyCar</span>
              </div>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-white">
                Llaves para el hogar.{" "}
                <span className="text-[#1473E6]">¡Próximamente!</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
                Muy pronto sumaremos duplicado de llaves computadas, doble
                paleta y cilindros de seguridad domiciliaria en nuestra sucursal
                de Av. Gral. San Martín 1574. Dejanos tu WhatsApp o email para
                avisarte del lanzamiento.
              </p>
            </div>

            <div className="lg:col-span-5">
              {submitted ? (
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#25D366] flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-white font-medium">
                    ¡Gracias! Agendamos tu contacto para avisarte apenas
                    inauguremos la línea de llaves para el hogar.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-2.5"
                >
                  <label htmlFor="home-keys-contact" className="sr-only">
                    Tu WhatsApp o Email
                  </label>
                  <input
                    id="home-keys-contact"
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Tu WhatsApp o Email (ej: 11 4567-8900)"
                    className="flex-1 px-4 py-3 rounded-xl bg-white text-[#0B1B2E] placeholder:text-[#4A5568] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1473E6]"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8] transition-colors flex-shrink-0"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Avisarme</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
