"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const loginSchema = z.object({
  email: z.string().email("Ingresá un email válido"),
  password: z.string().min(4, "Ingresá tu contraseña"),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@keycar.com.ar");
  const [password, setPassword] = useState("KeyCar2026!");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      let customEmail: string | null = null;
      let customPassword: string | null = null;
      if (typeof window !== "undefined") {
        customEmail = window.localStorage.getItem("keycar_custom_admin_email");
        customPassword = window.localStorage.getItem("keycar_custom_admin_pw");
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          customEmail,
          customPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Credenciales incorrectas.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Error de conexión al intentar iniciar sesión.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-8 px-3 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <Logo variant="light" size="lg" />
        </div>
        <h1 className="text-center font-heading font-extrabold text-xl sm:text-2xl text-[#0B1B2E]">
          Sistema de Gestión Privado
        </h1>
        <p className="mt-1 text-center text-xs sm:text-sm text-[#4A5568]">
          CRM, Trabajos, Finanzas y Reportes · Florencio Varela
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 sm:py-8 sm:px-8 shadow-card rounded-2xl border border-[#E2E8F0]">
          {/* Initial Seed Credentials Notice */}
          <div className="mb-5 p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold text-[#0B1B2E] inline-flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#1473E6]" />
                Acceso Inicial (Seed)
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@keycar.com.ar");
                  setPassword("KeyCar2026!");
                }}
                className="text-[11px] font-bold text-[#1473E6] hover:underline"
              >
                Cargar datos
              </button>
            </div>
            <p className="text-[#4A5568]">
              Email: <code className="font-semibold text-[#0B1B2E]">admin@keycar.com.ar</code> ·
              Clave: <code className="font-semibold text-[#0B1B2E]">KeyCar2026!</code>
            </p>
            <p className="text-[11px] text-[#4A5568] mt-1">
              Se recomienda actualizar la contraseña inicial desde{" "}
              <span className="font-semibold">Configuración</span> al ingresar.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold text-[#0B1B2E] mb-1"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#4A5568] absolute left-3.5 top-3" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0B1B2E] focus:outline-none focus:ring-2 focus:ring-[#1473E6]"
                  placeholder="admin@keycar.com.ar"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-[#0B1B2E] mb-1"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#4A5568] absolute left-3.5 top-3" />
                <input
                  id="admin-password"
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0B1B2E] focus:outline-none focus:ring-2 focus:ring-[#1473E6]"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label="Mostrar u ocultar contraseña"
                  className="absolute right-3 top-2.5 text-[#4A5568] hover:text-[#0B1B2E]"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8] disabled:opacity-60 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? "Verificando acceso..." : "Ingresar al Panel"}</span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#E2E8F0] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A5568] hover:text-[#1473E6] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la Landing Page de KeyCar</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
