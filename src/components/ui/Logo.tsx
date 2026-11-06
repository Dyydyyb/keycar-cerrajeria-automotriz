import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark"; // light = white background (#0B1B2E for "Key"), dark = dark background (#FFFFFF for "Key")
  size?: "sm" | "md" | "lg";
  href?: string;
  showSubtitle?: boolean;
  className?: string;
}

export function Logo({
  variant = "light",
  size = "md",
  href = "/",
  showSubtitle = true,
  className = "",
}: LogoProps) {
  const imageSizes = {
    sm: { width: 36, height: 36, box: "w-9 h-9" },
    md: { width: 44, height: 44, box: "w-11 h-11" },
    lg: { width: 54, height: 54, box: "w-13 h-13" },
  }[size];

  const textSizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  }[size];

  const keyColor = variant === "light" ? "text-[#0B1B2E]" : "text-white";

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      <div
        className={`relative ${imageSizes.box} rounded-lg overflow-hidden bg-[#0B1B2E] border border-[#E2E8F0]/30 flex-shrink-0 flex items-center justify-center shadow-sm`}
      >
        <Image
          src="/logo.png"
          alt="KeyCar - Especialistas en Llaves Automotrices"
          width={imageSizes.width}
          height={imageSizes.height}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`font-heading font-extrabold tracking-tight ${textSizes}`}
        >
          <span className={keyColor}>Key</span>
          <span className="text-[#1473E6]">Car</span>
        </span>
        {showSubtitle && (
          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.14em] mt-0.5 ${
              variant === "light" ? "text-[#4A5568]" : "text-slate-300"
            }`}
          >
            Cerrajería Automotriz
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1473E6] rounded-lg"
      >
        {content}
      </Link>
    );
  }

  return content;
}

