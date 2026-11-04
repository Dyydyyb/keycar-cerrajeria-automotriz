"use client";

import React from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/config/site";

interface BrandsSliderProps {
  onSelectBrand?: (brandName: string) => void;
}

export function BrandsSlider({ onSelectBrand }: BrandsSliderProps) {
  const brands = SITE_CONFIG.brands;
  // Duplicate array for seamless infinite marquee loop
  const marqueeBrands = [...brands, ...brands];

  const handleBrandClick = (brandName: string) => {
    if (onSelectBrand) {
      onSelectBrand(brandName);
      const el = document.getElementById("cotiza");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="marcas"
      className="py-10 sm:py-14 bg-white border-b border-[#E2E8F0] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#1473E6] mb-1">
              Cobertura Multimarca
            </span>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-[#0B1B2E]">
              Trabajamos con todas las marcas
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4A5568]">
            Tocá tu marca para preseleccionarla en el cotizador online
          </p>
        </div>
      </div>

      {/* Infinite Marquee Track (Pause on hover) */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Subtle left/right fade masks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-white to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-white to-transparent z-10"
        />

        <div className="animate-marquee flex items-center gap-3 sm:gap-4 px-2">
          {marqueeBrands.map((brand, index) => (
            <button
              key={`${brand.id}-${index}`}
              type="button"
              onClick={() => handleBrandClick(brand.name)}
              title={`Cotizar llave para ${brand.name}`}
              className="group flex-shrink-0 w-[150px] sm:w-[175px] lg:w-[190px] h-20 sm:h-24 bg-[#F5F7FA] hover:bg-white border border-[#E2E8F0] hover:border-[#1473E6] rounded-xl px-4 py-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 shadow-sm hover:shadow-card"
            >
              <div className="relative w-20 h-9 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                <Image
                  src={brand.logoPath}
                  alt={`Logo ${brand.name}`}
                  width={84}
                  height={36}
                  className="object-contain max-h-8 w-auto"
                />
              </div>
              <span className="font-heading font-bold text-xs sm:text-sm text-[#4A5568] group-hover:text-[#0B1B2E] transition-colors">
                {brand.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
