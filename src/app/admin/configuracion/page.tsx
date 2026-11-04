"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  Lock,
  CheckCircle2,
  RotateCcw,
  Home,
  Building2,
  BarChart3,
} from "lucide-react";
import { useKeyCar } from "@/context/KeyCarContext";

export default function AdminConfiguracionPage() {
  const { db, updateSettings, resetDemoData } = useKeyCar();

  const [form, setForm] = useState({
    businessName: db.settings.businessName,
    slogan: db.settings.slogan,
    address: db.settings.address,
    whatsappDisplay: db.settings.whatsappDisplay,
    phoneSecondary: db.settings.phoneSecondary,
    instagram: db.settings.instagram,
    facebook: db.settings.facebook,
    schedule: db.settings.schedule,
    statKeysDone: db.settings.statKeysDone,
    statHours: db.settings.statHours,
    statBrands: db.settings.statBrands,
  });

  const [adminEmail, setAdminEmail] = useState(
    db.settings.adminEmail || "admin@keycar.com.ar"
  );
  const [newPassword, setNewPassword] = useState("");
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const notify = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...form,
      statKeysDone: Number(form.statKeysDone) || 2000,
      statHours: Number(form.statHours) || 24,
      statBrands: Number(form.statBrands) || 16,
    });
    notify("Datos del negocio y contadores públicos actualizados con éxito.");
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 6) {
      notify("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "keycar_custom_admin_email",
        adminEmail.trim().toLowerCase()
      );
      window.localStorage.setItem("keycar_custom_admin_pw", newPassword);
    }
    updateSettings({ adminEmail: adminEmail.trim().toLowerCase() });
    setNewPassword("");
    notify("Credenciales de administrador actualizadas correctamente.");
  };

  return (
    <div className="space-y-5">
      {savedNotice && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0B1B2E] text-white px-4 py-3 rounded-xl shadow-cardHover border border-white/15 flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#25D366] flex-shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1473E6]">
            Parámetros del Sistema · KeyCar Florencio Varela
          </span>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B1B2E]">
            Configuración General
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            resetDemoData();
            notify("Base de datos restaurada con el seed original (~60 clientes, ~210 trabajos).");
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0B1B2E] bg-[#F5F7FA] hover:bg-[#E2E8F0] border border-[#E2E8F0] transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#1473E6]" />
          <span>Restaurar Datos Seed</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form 1: Datos del Negocio & Contadores de la Landing */}
        <form
          onSubmit={handleSaveBusiness}
          className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-card space-y-4 text-xs"
        >
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
            <Building2 className="w-4 h-4 text-[#1473E6]" />
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
              Datos del Negocio y Contadores Editables
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Nombre Comercial
              </label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) =>
                  setForm({ ...form, businessName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Slogan Oficial
              </label>
              <input
                type="text"
                value={form.slogan}
                onChange={(e) => setForm({ ...form, slogan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Dirección del Taller
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                WhatsApp Principal
              </label>
              <input
                type="text"
                value={form.whatsappDisplay}
                onChange={(e) =>
                  setForm({ ...form, whatsappDisplay: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Teléfono Adicional
              </label>
              <input
                type="text"
                value={form.phoneSecondary}
                onChange={(e) =>
                  setForm({ ...form, phoneSecondary: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Instagram
              </label>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) =>
                  setForm({ ...form, instagram: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Facebook
              </label>
              <input
                type="text"
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>
          </div>

          {/* Editable Public Counters */}
          <div className="pt-2 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-1.5 mb-2">
              <BarChart3 className="w-4 h-4 text-[#1473E6]" />
              <span className="font-heading font-bold text-xs sm:text-sm text-[#0B1B2E]">
                Contadores Públicos de la Landing Page (Placeholders Editables)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Llaves realizadas (+)
                </label>
                <input
                  type="number"
                  value={form.statKeysDone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      statKeysDone: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Horario (hs)
                </label>
                <input
                  type="number"
                  value={form.statHours}
                  onChange={(e) =>
                    setForm({ ...form, statHours: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Marcas trabajadas (+)
                </label>
                <input
                  type="number"
                  value={form.statBrands}
                  onChange={(e) =>
                    setForm({ ...form, statBrands: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1473E6] hover:bg-[#0F5BB8] text-white font-bold transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </form>

        {/* Right Column: Admin User Security & Waitlist "Llaves para el hogar" */}
        <div className="lg:col-span-5 space-y-5">
          {/* Change Admin Password */}
          <form
            onSubmit={handleSavePassword}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-card space-y-3 text-xs"
          >
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
              <Lock className="w-4 h-4 text-[#1473E6]" />
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
                Seguridad y Usuario Administrador
              </h2>
            </div>

            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Email del Administrador
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Nueva Contraseña (reemplaza la clave del seed)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresá una nueva contraseña segura..."
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1B2E] hover:bg-[#1473E6] text-white font-bold transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Actualizar Credenciales</span>
            </button>
          </form>

          {/* Waitlist Contacts for "Llaves para el hogar - Próximamente" */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-card space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-[#1473E6]" />
                <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
                  Interesados: &ldquo;Llaves para el hogar&rdquo;
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#F5F7FA] border border-[#E2E8F0] font-bold text-[#1473E6]">
                {db.waitlist.length}
              </span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {db.waitlist.map((w) => (
                <div
                  key={w.id}
                  className="p-2.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-between"
                >
                  <span className="font-bold text-[#0B1B2E]">{w.contact}</span>
                  <span className="text-[11px] text-[#4A5568]">
                    {new Date(w.createdAt).toLocaleDateString("es-AR")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
