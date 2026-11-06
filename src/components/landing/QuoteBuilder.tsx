"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  KeyRound,
  Radio,
  Cpu,
  Wrench,
  Lock,
  PanelTop,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Send,
  Sparkles,
  CarFront,
  User,
  MapPin,
  Clock,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { useKeyCar } from "@/context/KeyCarContext";

const ICON_MAP: Record<string, React.ElementType> = {
  KeyRound,
  Radio,
  Cpu,
  Wrench,
  Lock,
  PanelTop,
  ShieldAlert,
  HelpCircle,
};

const step3Schema = z.object({
  model: z.string().min(1, "Ingresá o elegí el modelo del vehículo"),
  year: z
    .string()
    .min(2, "Ingresá el año aproximado")
    .max(10, "Año inválido"),
  situation: z.string().min(1, "Seleccioná cuál es tu situación actual"),
});

const step4Schema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  zone: z.string().min(2, "Ingresá tu zona o localidad"),
});

interface QuoteBuilderProps {
  preselectedService?: string | null;
  preselectedBrand?: string | null;
}

export function QuoteBuilder({
  preselectedService,
  preselectedBrand,
}: QuoteBuilderProps) {
  const { addLead } = useKeyCar();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [service, setService] = useState<string>("Copias de llaves");
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<string>("2019");
  const [situation, setSituation] = useState<string>(
    "Tengo una sola y quiero copia"
  );
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [zone, setZone] = useState<string>("Florencio Varela");
  const [schedule, setSchedule] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [isMessageEdited, setIsMessageEdited] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [submittedVia, setSubmittedVia] = useState<"web" | "whatsapp" | null>(
    null
  );

  // Sync preselected service from Services Cards
  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
      if (preselectedService.toLowerCase().includes("cero llaves")) {
        setSituation("Perdí todas las llaves");
      }
      setStep(2);
      setSubmittedLeadId(null);
    }
  }, [preselectedService]);

  // Sync preselected brand from Brands Slider
  useEffect(() => {
    if (preselectedBrand) {
      setBrand(preselectedBrand);
      setModel("");
      if (step < 3) setStep(3);
      setSubmittedLeadId(null);
    }
  }, [preselectedBrand]);

  // Build automatic message preview unless user manually edited it
  useEffect(() => {
    if (isMessageEdited) return;
    const displayName = name.trim() || "[Tu Nombre]";
    const displayZone = zone.trim() || "Florencio Varela";
    const displayService = service || "cerrajería automotriz";
    const displayBrand = brand || "[Marca]";
    const displayModel = model.trim() || "[Modelo]";
    const displayYear = year.trim() || "";
    const schedulePart = schedule.trim()
      ? ` Horario preferido: ${schedule.trim()}.`
      : "";

    const msg = `Hola KeyCar! Soy ${displayName}, de ${displayZone}. Necesito ${displayService} para mi ${displayBrand} ${displayModel} ${displayYear}. Situación: ${situation}.${schedulePart} ¿Me pasan presupuesto y disponibilidad? Gracias!`;
    setCustomMessage(msg);
  }, [
    name,
    zone,
    service,
    brand,
    model,
    year,
    situation,
    schedule,
    isMessageEdited,
  ]);

  const serviceOptions = [
    ...SITE_CONFIG.services.map((s) => ({
      id: s.id,
      title: s.title,
      short: s.shortTitle,
      slogan: s.slogan,
      iconName: s.iconName,
      isEmergency: s.isEmergency,
    })),
    {
      id: "srv-otro",
      title: "Otro servicio / Consulta general",
      short: "Otro / Consulta",
      slogan: "Asesoramiento personalizado",
      iconName: "HelpCircle",
      isEmergency: false,
    },
  ];

  const selectedBrandObj = SITE_CONFIG.brands.find(
    (b) => b.name.toLowerCase() === brand.toLowerCase()
  );

  const quickZones = [
    "Florencio Varela",
    "Cruce Varela",
    "Bosques",
    "Berazategui",
    "Quilmes",
    "Solano",
  ];

  const handleNextStep = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!service) {
        setErrorMsg("Seleccioná un tipo de servicio para continuar.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!brand) {
        setErrorMsg("Seleccioná la marca de tu vehículo para continuar.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      const check = step3Schema.safeParse({ model, year, situation });
      if (!check.success) {
        setErrorMsg(check.error.issues[0].message);
        return;
      }
      setStep(4);
    }
  };

  const validateAndSaveLead = (origin: "Web" | "WhatsApp") => {
    setErrorMsg(null);
    const check = step4Schema.safeParse({ name, zone });
    if (!check.success) {
      setErrorMsg(check.error.issues[0].message);
      return null;
    }

    const created = addLead({
      name,
      phone: phone || undefined,
      zone,
      preferredSchedule: schedule || undefined,
      serviceName: service,
      brand: brand || "Consultar",
      model: model || "Consultar",
      year: year || "S/D",
      situation,
      message: customMessage,
      origin: "Web",
    });

    setSubmittedLeadId(created.id);
    setSubmittedVia(origin === "WhatsApp" ? "whatsapp" : "web");
    return created;
  };

  const handleSendWhatsApp = () => {
    const created = validateAndSaveLead("WhatsApp");
    if (!created) return;

    const url = `${SITE_CONFIG.business.contact.whatsappUrl}?text=${encodeURIComponent(
      customMessage
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSendWebLead = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndSaveLead("Web");
  };

  const handleReset = () => {
    setSubmittedLeadId(null);
    setSubmittedVia(null);
    setIsMessageEdited(false);
    setStep(1);
  };

  const progressPercentage = (step / 4) * 100;

  return (
    <section
      id="cotiza"
      className="py-10 sm:py-16 lg:py-20 bg-white border-b border-[#E2E8F0]"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F7FA] border border-[#E2E8F0] text-xs font-bold text-[#1473E6] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cotizador Inteligente en 4 pasos</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B1B2E] tracking-tight">
            Armá tu consulta personalizada
          </h2>
          <p className="text-xs sm:text-base text-[#4A5568] mt-1.5">
            Elegí el servicio y tu vehículo para generar el diagnóstico inicial
            y enviarlo directo a nuestro taller o por WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left / Main Stepper Card (8 cols on desktop) */}
          <div className="lg:col-span-8 bg-[#F5F7FA] border border-[#E2E8F0] rounded-2xl p-3.5 sm:p-6 lg:p-7 shadow-card">
            {/* Step Progress Indicator */}
            <div className="mb-5">
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-2.5">
                {[
                  { num: 1, label: "1. Servicio" },
                  { num: 2, label: "2. Marca" },
                  { num: 3, label: "3. Vehículo" },
                  { num: 4, label: "4. Envío" },
                ].map((s) => {
                  const isActive = step === s.num;
                  const isDone = step > s.num;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => {
                        if (s.num < step) {
                          setErrorMsg(null);
                          setStep(s.num as 1 | 2 | 3 | 4);
                        }
                      }}
                      disabled={s.num > step}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        isActive
                          ? "bg-[#1473E6] text-white border-[#1473E6] shadow-sm"
                          : isDone
                          ? "bg-white text-[#0B1B2E] border-[#1473E6]/40 hover:bg-[#1473E6]/5 cursor-pointer"
                          : "bg-white/60 text-[#4A5568]/60 border-[#E2E8F0] cursor-not-allowed"
                      }`}
                    >
                      {isDone && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1473E6] flex-shrink-0 hidden sm:inline" />
                      )}
                      <span className="truncate">{s.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1473E6] transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Validation Error Alert */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {/* STEP 1: SERVICE SELECTION */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-[#0B1B2E]">
                      Paso 1: ¿Qué servicio necesitás?
                    </h3>
                    <span className="text-xs text-[#4A5568]">
                      Tocá una opción
                    </span>
                  </div>

                  {/* 2 columns on mobile to use horizontal space & avoid vertical scroll */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {serviceOptions.map((opt) => {
                      const Icon = ICON_MAP[opt.iconName] || KeyRound;
                      const isSelected = service === opt.title;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setService(opt.title);
                            if (opt.isEmergency) {
                              setSituation("Perdí todas las llaves");
                            }
                            setErrorMsg(null);
                            setStep(2);
                          }}
                          className={`text-left p-3 sm:p-4 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                            isSelected
                              ? "bg-white border-2 border-[#1473E6] shadow-card"
                              : "bg-white border-[#E2E8F0] hover:border-[#1473E6]/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div
                              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "bg-[#1473E6] text-white"
                                  : opt.isEmergency
                                  ? "bg-[#0B1B2E] text-white"
                                  : "bg-[#F5F7FA] text-[#1473E6]"
                              }`}
                            >
                              <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                            </div>
                            {isSelected && (
                              <span className="text-[11px] font-bold text-[#1473E6] bg-[#1473E6]/10 px-2 py-0.5 rounded-full">
                                Elegido
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-heading font-bold text-xs sm:text-sm text-[#0B1B2E] leading-snug">
                              {opt.title}
                            </p>
                            <p className="text-[11px] text-[#4A5568] mt-0.5 line-clamp-1">
                              {opt.slogan}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8] transition-colors"
                    >
                      <span>Siguiente: Elegir marca</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: BRAND SELECTION */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-[#0B1B2E]">
                      Paso 2: Seleccioná la marca de tu auto
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-[#1473E6] hover:underline inline-flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Volver
                    </button>
                  </div>

                  {/* 3 columns on mobile, 4 on tablet/desktop */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {SITE_CONFIG.brands.map((b) => {
                      const isSelected = brand === b.name;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setBrand(b.name);
                            setModel("");
                            setErrorMsg(null);
                            setStep(3);
                          }}
                          className={`p-2.5 sm:p-3 rounded-xl border bg-white flex flex-col items-center justify-center gap-1.5 transition-all ${
                            isSelected
                              ? "border-2 border-[#1473E6] shadow-card"
                              : "border-[#E2E8F0] hover:border-[#1473E6]/60"
                          }`}
                        >
                          <div className="w-14 h-6 flex items-center justify-center">
                            <Image
                              src={b.logoPath}
                              alt={b.name}
                              width={56}
                              height={24}
                              className="object-contain max-h-6 w-auto"
                            />
                          </div>
                          <span className="font-heading font-bold text-[11px] sm:text-xs text-[#0B1B2E] truncate max-w-full">
                            {b.name}
                          </span>
                        </button>
                      );
                    })}

                    {/* Option 17: "Otra marca" */}
                    <button
                      type="button"
                      onClick={() => {
                        setBrand("Otra marca");
                        setModel("");
                        setErrorMsg(null);
                        setStep(3);
                      }}
                      className={`p-2.5 sm:p-3 rounded-xl border bg-white flex flex-col items-center justify-center gap-1.5 transition-all col-span-3 sm:col-span-4 ${
                        brand === "Otra marca"
                          ? "border-2 border-[#1473E6] shadow-card"
                          : "border-[#E2E8F0] hover:border-[#1473E6]/60"
                      }`}
                    >
                      <span className="font-heading font-bold text-xs sm:text-sm text-[#0B1B2E]">
                        Otra marca automotriz
                      </span>
                    </button>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#0B1B2E] bg-white border border-[#E2E8F0] hover:bg-slate-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Anterior</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8]"
                    >
                      <span>Siguiente: Modelo y situación</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: MODEL, YEAR & SITUATION */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-[#0B1B2E]">
                      Paso 3: Modelo, año y situación ({brand || "Vehículo"})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-semibold text-[#1473E6] hover:underline inline-flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Cambiar marca
                    </button>
                  </div>

                  {/* Quick Model Suggestions for Selected Brand */}
                  {selectedBrandObj &&
                    selectedBrandObj.popularModels.length > 0 && (
                      <div className="mb-3.5">
                        <p className="text-xs font-semibold text-[#4A5568] mb-1.5">
                          Modelos frecuentes de {selectedBrandObj.name} (tocá
                          para elegir rápido):
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedBrandObj.popularModels.map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setModel(m)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                                model === m
                                  ? "bg-[#1473E6] text-white border-[#1473E6]"
                                  : "bg-white text-[#0B1B2E] border-[#E2E8F0] hover:border-[#1473E6]"
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Inputs: Model & Year in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="quote-model"
                        className="block text-xs font-bold text-[#0B1B2E] mb-1"
                      >
                        Modelo del auto *
                      </label>
                      <input
                        id="quote-model"
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="Ej: Cronos, Amarok, Kangoo, 208..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0B1B2E] focus:outline-none focus:ring-2 focus:ring-[#1473E6]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="quote-year"
                        className="block text-xs font-bold text-[#0B1B2E] mb-1"
                      >
                        Año *
                      </label>
                      <input
                        id="quote-year"
                        type="text"
                        inputMode="numeric"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="Ej: 2019"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0B1B2E] focus:outline-none focus:ring-2 focus:ring-[#1473E6]"
                      />
                    </div>
                  </div>

                  {/* Situation Selector */}
                  <div>
                    <label className="block text-xs font-bold text-[#0B1B2E] mb-2">
                      ¿Cuál es tu situación actual? *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SITE_CONFIG.situations.map((sit) => {
                        const isSelected = situation === sit;
                        const isUrgent =
                          sit.toLowerCase().includes("perdí") ||
                          sit.toLowerCase().includes("urgencia");
                        return (
                          <button
                            key={sit}
                            type="button"
                            onClick={() => setSituation(sit)}
                            className={`text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-2 ${
                              isSelected
                                ? "bg-white border-2 border-[#1473E6] text-[#0B1B2E] shadow-sm"
                                : "bg-white border-[#E2E8F0] text-[#4A5568] hover:border-[#1473E6]/50"
                            }`}
                          >
                            <span>{sit}</span>
                            {isUrgent && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0B1B2E] text-white flex-shrink-0">
                                24 hs
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#0B1B2E] bg-white border border-[#E2E8F0] hover:bg-slate-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Anterior</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8]"
                    >
                      <span>Siguiente: Tus datos y mensaje</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: USER DETAILS & EDITABLE MESSAGE PREVIEW */}
              {step === 4 && (
                <motion.form
                  key="step-4"
                  onSubmit={handleSendWebLead}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-[#0B1B2E]">
                      Paso 4: Completá tus datos y revisá el mensaje
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs font-semibold text-[#1473E6] hover:underline inline-flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Editar vehículo
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label
                        htmlFor="quote-name"
                        className="block text-xs font-bold text-[#0B1B2E] mb-1"
                      >
                        Tu nombre *
                      </label>
                      <input
                        id="quote-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Martín Rodríguez"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0B1B2E] focus:outline-none focus:ring-2 focus:ring-[#1473E6]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="quote-phone"
                        className="block text-xs font-bold text-[#0B1B2E] mb-1"
                      >
                        Tu WhatsApp / Teléfono (opcional)
                      </label>
                      <input
                        id="quote-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej: 11 4567-8901"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0B1B2E] focus:outline-none focus:ring-2 focus:ring-[#1473E6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label
                        htmlFor="quote-zone"
                        className="block text-xs font-bold text-[#0B1B2E] mb-1"
                      >
                        Zona / Localidad *
                      </label>
                      <input
                        id="quote-zone"
                        type="text"
                        value={zone}
                        onChange={(e) => setZone(e.target.value)}
                        placeholder="Ej: Florencio Varela, Bosques..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0B1B2E] focus:outline-none focus:ring-2 focus:ring-[#1473E6]"
                      />
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {quickZones.map((z) => (
                          <button
                            key={z}
                            type="button"
                            onClick={() => setZone(z)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              zone === z
                                ? "bg-[#0B1B2E] text-white border-[#0B1B2E]"
                                : "bg-white text-[#4A5568] border-[#E2E8F0] hover:border-[#0B1B2E]"
                            }`}
                          >
                            {z}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="quote-schedule"
                        className="block text-xs font-bold text-[#0B1B2E] mb-1"
                      >
                        Horario preferido (opcional)
                      </label>
                      <select
                        id="quote-schedule"
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0B1B2E] focus:outline-none focus:ring-2 focus:ring-[#1473E6]"
                      >
                        <option value="">A coordinar / Lo antes posible</option>
                        <option value="Urgencia 24 hs (Ahora)">
                          Urgencia 24 hs (Ahora)
                        </option>
                        <option value="Por la mañana (8 a 13 hs)">
                          Por la mañana (8 a 13 hs)
                        </option>
                        <option value="Por la tarde (13 a 19 hs)">
                          Por la tarde (13 a 19 hs)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Editable Auto-Generated Message Preview */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="quote-message"
                        className="text-xs font-bold text-[#0B1B2E]"
                      >
                        Vista previa de tu mensaje (podés editarlo):
                      </label>
                      {isMessageEdited && (
                        <button
                          type="button"
                          onClick={() => setIsMessageEdited(false)}
                          className="text-[11px] font-semibold text-[#1473E6] hover:underline inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Restaurar texto automático
                        </button>
                      )}
                    </div>
                    <textarea
                      id="quote-message"
                      rows={3}
                      value={customMessage}
                      onChange={(e) => {
                        setCustomMessage(e.target.value);
                        setIsMessageEdited(true);
                      }}
                      className="w-full p-3 rounded-xl bg-white border border-[#1473E6]/40 text-xs sm:text-sm text-[#0B1B2E] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1473E6]"
                    />
                  </div>

                  {/* Confirmation Banner if submitted */}
                  {submittedLeadId && (
                    <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs sm:text-sm font-bold">
                            {submittedVia === "whatsapp"
                              ? "¡Consulta registrada y abriendo WhatsApp!"
                              : "¡Consulta enviada con éxito a KeyCar!"}
                          </p>
                          <p className="text-xs text-emerald-700">
                            Quedó agendada en nuestro sistema de gestión con
                            estado &ldquo;Nuevo&rdquo; (Origen: Web).
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 flex-shrink-0"
                      >
                        Nueva consulta
                      </button>
                    </div>
                  )}

                  {/* Final Action Buttons: "Enviar por WhatsApp" & "Enviar consulta" */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleSendWhatsApp}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8] transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Enviar por WhatsApp</span>
                    </button>
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-[#0B1B2E] bg-white hover:bg-slate-50 border-2 border-[#0B1B2E]/15 hover:border-[#0B1B2E]/30 transition-colors"
                    >
                      <Send className="w-4 h-4 text-[#1473E6]" />
                      <span>Enviar consulta por la Web</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Live Summary Card (Sticky on Desktop, Compact on Mobile) */}
          <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-card lg:sticky lg:top-24">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E8F0]">
              <h3 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
                Resumen de tu consulta
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F5F7FA] text-[#1473E6] border border-[#E2E8F0]">
                Paso {step} de 4
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 text-xs sm:text-sm mb-4">
              <div className="p-2.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                <span className="text-[11px] font-semibold text-[#4A5568] flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#1473E6]" />
                  Servicio
                </span>
                <p className="font-bold text-[#0B1B2E] truncate mt-0.5">
                  {service || "Por seleccionar"}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                <span className="text-[11px] font-semibold text-[#4A5568] flex items-center gap-1">
                  <CarFront className="w-3.5 h-3.5 text-[#1473E6]" />
                  Vehículo
                </span>
                <p className="font-bold text-[#0B1B2E] truncate mt-0.5">
                  {brand
                    ? `${brand} ${model || ""} ${year || ""}`.trim()
                    : "Por seleccionar"}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                <span className="text-[11px] font-semibold text-[#4A5568] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1473E6]" />
                  Situación
                </span>
                <p className="font-bold text-[#0B1B2E] truncate mt-0.5">
                  {situation}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                <span className="text-[11px] font-semibold text-[#4A5568] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#1473E6]" />
                  Solicitante
                </span>
                <p className="font-bold text-[#0B1B2E] truncate mt-0.5">
                  {name ? `${name} (${zone})` : `Zona: ${zone}`}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B1B2E] text-white text-xs">
              <div className="flex items-center gap-2 font-bold mb-1">
                <MapPin className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                <span>Taller en Florencio Varela</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Av. Gral. San Martín 1574 (CP 1888). Atención las 24 hs para
                urgencias y programación en el acto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

