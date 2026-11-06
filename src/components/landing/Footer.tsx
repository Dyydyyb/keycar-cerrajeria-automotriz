import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SITE_CONFIG } from "@/config/site";

export function Footer() {
  const { business, services } = SITE_CONFIG;

  return (
    <footer className="bg-[#0B1B2E] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4">
            <Logo variant="dark" size="md" />
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed max-w-sm">
              “{business.slogan}”. Especialistas en llaves automotrices,
              programación de telemandos, clonación de transponder y cerrajería
              24 hs en Florencio Varela.
            </p>
            <div className="flex items-center gap-2 mt-4">
              {business.values.map((v) => (
                <span
                  key={v.id}
                  className="px-2.5 py-1 rounded-md bg-white/10 text-[11px] font-semibold text-slate-200"
                >
                  {v.title}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links & Services (2 columns side by side on mobile) */}
          <div className="grid grid-cols-2 gap-4 sm:col-span-1 lg:col-span-5">
            <div>
              <h3 className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-white mb-3">
                Navegación
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                <li>
                  <a href="#servicios" className="hover:text-white transition-colors">
                    Servicios
                  </a>
                </li>
                <li>
                  <a href="#marcas" className="hover:text-white transition-colors">
                    Marcas
                  </a>
                </li>
                <li>
                  <a href="#cotiza" className="hover:text-white transition-colors">
                    Armá tu consulta
                  </a>
                </li>
                <li>
                  <a href="#nosotros" className="hover:text-white transition-colors">
                    Por qué elegirnos
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="hover:text-white transition-colors">
                    Contacto y mapa
                  </a>
                </li>
                <li className="pt-1">
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 text-[#1473E6] hover:text-white font-semibold transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Panel Admin</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-white mb-3">
                Especialidades
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {services.slice(0, 6).map((s) => (
                  <li key={s.id}>
                    <a
                      href="#cotiza"
                      className="hover:text-white transition-colors line-clamp-1"
                    >
                      {s.shortTitle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 3: Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-white mb-3">
              Contacto Directo
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#1473E6] flex-shrink-0 mt-0.5" />
                <span>{business.address.full}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                <div>
                  <a
                    href="tel:+5491178944996"
                    className="hover:text-white font-semibold"
                  >
                    11 7894-4996
                  </a>
                  <span className="mx-1.5 text-slate-500">/</span>
                  <a
                    href="tel:+5492213638369"
                    className="hover:text-white font-semibold"
                  >
                    221 363-8369
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                <span>Atención las 24 hs</span>
              </li>
            </ul>

            <div className="flex items-center gap-3 mt-4">
              <a
                href={business.contact.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de KeyCar"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#1473E6] flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={business.contact.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de KeyCar"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#1473E6] flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} KeyCar - Especialistas en Llaves
            Automotrices. Todos los derechos reservados.
          </p>
          <p>Florencio Varela, Buenos Aires (CP 1888) · Argentina</p>
        </div>
      </div>
    </footer>
  );
}

