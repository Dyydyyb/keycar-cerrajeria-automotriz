"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquareMore,
  Wrench,
  Wallet,
  FileBarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useKeyCar } from "@/context/KeyCarContext";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    shortLabel: "Inicio",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Consultas (Leads)",
    shortLabel: "Leads",
    href: "/admin/leads",
    icon: MessageSquareMore,
    badgeKey: "leads" as const,
  },
  {
    label: "CRM Clientes",
    shortLabel: "Clientes",
    href: "/admin/clientes",
    icon: Users,
  },
  {
    label: "Trabajos Taller",
    shortLabel: "Trabajos",
    href: "/admin/trabajos",
    icon: Wrench,
  },
  {
    label: "Finanzas y Caja",
    shortLabel: "Finanzas",
    href: "/admin/finanzas",
    icon: Wallet,
  },
  {
    label: "Reportes",
    shortLabel: "Reportes",
    href: "/admin/reportes",
    icon: FileBarChart2,
  },
  {
    label: "Configuración",
    shortLabel: "Config",
    href: "/admin/configuracion",
    icon: Settings,
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { db } = useKeyCar();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidePwBanner, setHidePwBanner] = useState(false);

  // If on login route, render pure login layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const newLeadsCount = db.leads.filter((l) => l.status === "NUEVO").length;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#4A5568]">
      {/* Desktop Sidebar (Fixed to Viewport, Full 100vh, Never Cuts Off on Scroll) */}
      <aside
        className={`no-print hidden lg:flex flex-col bg-[#0B1B2E] text-white border-r border-white/10 transition-all duration-200 fixed inset-y-0 left-0 z-30 h-screen ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          {!collapsed ? (
            <Logo variant="dark" size="sm" href="/admin" />
          ) : (
            <Logo
              variant="dark"
              size="sm"
              href="/admin"
              showSubtitle={false}
              className="mx-auto"
            />
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Links (Scrollable if screen height is constrained) */}
        <nav className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto min-h-0">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#1473E6] text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed &&
                  item.badgeKey === "leads" &&
                  newLeadsCount > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isActive
                          ? "bg-white text-[#1473E6]"
                          : "bg-[#1473E6] text-white"
                      }`}
                    >
                      {newLeadsCount}
                    </span>
                  )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/10 space-y-1.5 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0 text-[#1473E6]" />
            {!collapsed && <span>Ver Landing Pública</span>}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar (#0B1B2E) */}
      <header className="no-print lg:hidden sticky top-0 z-40 bg-[#0B1B2E] text-white border-b border-white/10">
        <div className="px-3 h-14 flex items-center justify-between gap-2">
          <Logo variant="dark" size="sm" href="/admin" showSubtitle={false} />

          {/* Horizontal Quick Pills on Mobile for instant tab switching without opening drawer */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/"
              className="px-2.5 py-1.5 rounded-lg bg-white/10 text-xs font-semibold text-slate-200 hover:text-white inline-flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#1473E6]" />
              <span className="hidden sm:inline">Web</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú de administración"
              className="p-2 rounded-lg bg-white/10 text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Scrollable Navigation Strip (avoids opening menu every time!) */}
        <div className="px-2 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-white/5 pt-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-[#1473E6] text-white"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.shortLabel}</span>
                {item.badgeKey === "leads" && newLeadsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-[#1473E6]">
                    {newLeadsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Drawer Dropdown */}
        {mobileMenuOpen && (
          <div className="bg-[#0B1B2E] border-t border-white/10 p-3 space-y-2 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold ${
                      isActive
                        ? "bg-[#1473E6] text-white"
                        : "bg-white/5 text-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-red-500/20 text-red-200 border border-red-400/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area: offset on desktop to match the fixed sidebar */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          collapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Initial Password Change Security Prompt */}
        {!hidePwBanner && (
          <div className="no-print bg-amber-50 border-b border-amber-200 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 text-xs text-amber-900">
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="truncate">
                Estás usando el usuario inicial del seed (
                <strong>admin@keycar.com.ar</strong>). Podés cambiar tu
                contraseña en{" "}
                <Link
                  href="/admin/configuracion"
                  className="font-bold underline hover:text-amber-950"
                >
                  Configuración
                </Link>
                .
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHidePwBanner(true)}
              className="text-amber-700 hover:text-amber-950 font-bold flex-shrink-0"
            >
              Ocultar
            </button>
          </div>
        )}

        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

