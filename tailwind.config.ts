import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1473E6",
          hover: "#0F5BB8",
          dark: "#0B1B2E",
          bg: "#FFFFFF",
          alt: "#F5F7FA",
          text: "#4A5568",
          border: "#E2E8F0",
          whatsapp: "#25D366",
          whatsappHover: "#1FAF54",
        },
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px -2px rgba(11, 27, 46, 0.06), 0 1px 3px -1px rgba(11, 27, 46, 0.04)",
        cardHover: "0 10px 25px -5px rgba(11, 27, 46, 0.09), 0 4px 10px -2px rgba(11, 27, 46, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
