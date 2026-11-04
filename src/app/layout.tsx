import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { KeyCarProvider } from "@/context/KeyCarContext";
import { SITE_CONFIG } from "@/config/site";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B1B2E",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://keycar.vercel.app"
  ),
  title: "KeyCar | Especialistas en Llaves Automotrices en Florencio Varela (24 hs)",
  description:
    "Cerrajería automotriz en Florencio Varela, Buenos Aires. Copias de llaves con chip, programación de telemandos, clonación de transponder, cierre centralizado, alzacristales y urgencias Cero Llaves las 24 hs. Av. Gral. San Martín 1574.",
  keywords: [
    "cerrajería automotriz Florencio Varela",
    "copia de llaves con chip",
    "programación de telemandos",
    "llaves codificadas Florencio Varela",
    "cerrajería 24 hs autos GBA Sur",
    "reparación de controles de auto",
    "clonación de transponder",
    "cierre centralizado y alzacristales",
    "KeyCar cerrajería",
  ],
  authors: [{ name: "KeyCar Cerrajería Automotriz" }],
  openGraph: {
    title: "KeyCar - Especialistas en Llaves Automotrices | Florencio Varela 24 hs",
    description:
      "Tu llave, nuestro trabajo. Copias con chip, telemandos, transponder, cierre centralizado, alzacristales y urgencias 24 hs en Av. Gral. San Martín 1574, Florencio Varela.",
    type: "website",
    locale: "es_AR",
    siteName: "KeyCar Cerrajería Automotriz",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "KeyCar - Especialistas en Llaves Automotrices",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Locksmith", "AutomotiveBusiness", "LocalBusiness"],
    name: "KeyCar - Especialistas en Llaves Automotrices",
    slogan: SITE_CONFIG.business.slogan,
    description:
      "Especialistas en llaves automotrices en Florencio Varela. Copias de llaves con chip, programación de telemandos, clonación de transponder, reparación de controles, cierre centralizado, alzacristales y urgencias Cero Llaves 24 hs.",
    image: "/logo.png",
    telephone: "+54-9-11-7894-4996",
    priceRange: "$$",
    openingHours: "Mo-Su 00:00-23:59",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Gral. San Martín 1574",
      addressLocality: "Florencio Varela",
      addressRegion: "Buenos Aires",
      postalCode: "1888",
      addressCountry: "AR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -34.7965,
      longitude: -58.2762,
    },
    sameAs: [
      SITE_CONFIG.business.contact.instagram.url,
      SITE_CONFIG.business.contact.facebook.url,
    ],
    areaServed: [
      "Florencio Varela",
      "Berazategui",
      "Quilmes",
      "San Francisco Solano",
      "Bosques",
      "Cruce Varela",
    ],
  };

  return (
    <html lang="es-AR" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-white text-[#4A5568] antialiased selection:bg-[#1473E6] selection:text-white">
        <KeyCarProvider>{children}</KeyCarProvider>
      </body>
    </html>
  );
}
