"use client";

import React, { useState, useMemo } from "react";
import {
  MessageSquareMore,
  Plus,
  Search,
  UserPlus,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  CarFront,
  LayoutGrid,
  List,
  Trash2,
  X,
  Send,
  ChevronRight,
} from "lucide-react";
import { useKeyCar } from "@/context/KeyCarContext";
import { LeadRecord, LeadStatus } from "@/lib/types";
import { SITE_CONFIG } from "@/config/site";

const KANBAN_COLUMNS: {
  id: LeadStatus;
  title: string;
  badgeClass: string;
}[] = [
  {
    id: "NUEVO",
    title: "Nuevo",
    badgeClass: "bg-[#1473E6] text-white",
  },
  {
    id: "CONTACTADO",
    title: "Contactado",
    badgeClass: "bg-blue-50 text-[#1473E6] border border-blue-200",
  },
  {
    id: "PRESUPUESTADO",
    title: "Presupuestado",
    badgeClass: "bg-amber-50 text-amber-800 border border-amber-200",
  },
  {
    id: "CERRADO",
    title: "Cerrado (Ganado)",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  {
    id: "PERDIDO",
    title: "Perdido",
    badgeClass: "bg-slate-100 text-slate-600 border border-slate-200",
  },
];

export default function AdminLeadsPage() {
  const {
    db,
    addLead,
    updateLeadStatus,
    convertLeadToClient,
    addLeadNote,
    deleteLead,
  } = useKeyCar();

  const [viewMode, setViewMode] = useState<"KANBAN" | "LIST">("KANBAN");
  const [mobileActiveCol, setMobileActiveCol] = useState<LeadStatus>("NUEVO");
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("TODAS");
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New manual lead state
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    phone: "",
    zone: "Florencio Varela",
    serviceName: SITE_CONFIG.services[0].title,
    brand: "Volkswagen",
    model: "Gol Trend",
    year: "2019",
    situation: SITE_CONFIG.situations[1],
    origin: "WhatsApp" as "Web" | "WhatsApp" | "Instagram" | "Local",
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const filteredLeads = useMemo(() => {
    return db.leads.filter((l) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.brand.toLowerCase().includes(q) ||
        l.model.toLowerCase().includes(q) ||
        l.serviceName.toLowerCase().includes(q) ||
        l.zone.toLowerCase().includes(q);
      const matchesBrand =
        brandFilter === "TODAS" || l.brand === brandFilter;
      return matchesSearch && matchesBrand;
    });
  }, [db.leads, search, brandFilter]);

  const handleConvert = (lead: LeadRecord) => {
    const client = convertLeadToClient(lead.id);
    if (client) {
      showToast(
        `¡Lead "${lead.name}" convertido en cliente del CRM con su ${lead.brand} ${lead.model}!`
      );
      if (selectedLead?.id === lead.id) {
        setSelectedLead({ ...lead, status: "CERRADO", clientId: client.id });
      }
    }
  };

  const buildTemplateUrl = (lead: LeadRecord, templateText: string) => {
    const replaced = templateText
      .replace(/\{nombre\}/g, lead.name)
      .replace(/\{servicio\}/g, lead.serviceName)
      .replace(
        /\{vehiculo\}/g,
        `${lead.brand} ${lead.model} ${lead.year}`.trim()
      )
      .replace(/\{zona\}/g, lead.zone);

    const digits = (lead.phone || "").replace(/\D/g, "");
    const targetPhone =
      digits.length >= 8
        ? digits.startsWith("54")
          ? digits
          : `549${digits}`
        : SITE_CONFIG.business.contact.whatsappNumber;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(replaced)}`;
  };

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name.trim()) return;
    const msg = `Consulta recibida por ${newLeadForm.origin}: ${newLeadForm.serviceName} para ${newLeadForm.brand} ${newLeadForm.model} (${newLeadForm.year}). Situación: ${newLeadForm.situation}.`;
    addLead({
      ...newLeadForm,
      message: msg,
    });
    setShowNewModal(false);
    setNewLeadForm({
      ...newLeadForm,
      name: "",
      phone: "",
    });
    showToast("Nueva consulta registrada en columna 'Nuevo'.");
  };

  const liveSelectedLead = selectedLead
    ? db.leads.find((l) => l.id === selectedLead.id) || selectedLead
    : null;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0B1B2E] text-white px-4 py-3 rounded-xl shadow-cardHover border border-white/15 flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#25D366] flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1473E6]">
            Pipeline Comercial · Consultas Web y WhatsApp
          </span>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B1B2E]">
            Gestión de Consultas (Leads)
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex bg-[#F5F7FA] p-1 rounded-xl border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setViewMode("KANBAN")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === "KANBAN"
                  ? "bg-[#1473E6] text-white"
                  : "text-[#4A5568] hover:text-[#0B1B2E]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("LIST")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === "LIST"
                  ? "bg-[#1473E6] text-white"
                  : "text-[#4A5568] hover:text-[#0B1B2E]"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Tabla</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Consulta</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#4A5568] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, servicio, vehículo o zona..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs sm:text-sm text-[#0B1B2E] focus:outline-none focus:ring-2 focus:ring-[#1473E6]"
          />
        </div>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs sm:text-sm text-[#0B1B2E] font-medium"
        >
          <option value="TODAS">Todas las marcas</option>
          {SITE_CONFIG.brands.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === "KANBAN" && (
        <>
          {/* Mobile Stage Selector Tabs (Prevents horizontal overflow on mobile!) */}
          <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-1">
            {KANBAN_COLUMNS.map((col) => {
              const count = filteredLeads.filter(
                (l) => l.status === col.id
              ).length;
              const active = mobileActiveCol === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setMobileActiveCol(col.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                    active
                      ? "bg-[#0B1B2E] text-white border-[#0B1B2E]"
                      : "bg-white text-[#4A5568] border-[#E2E8F0]"
                  }`}
                >
                  <span>{col.title}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      active
                        ? "bg-[#1473E6] text-white"
                        : "bg-[#F5F7FA] text-[#0B1B2E]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Columns Grid (1 active column on mobile, 5 columns on desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3.5 items-start">
            {KANBAN_COLUMNS.map((col) => {
              const colLeads = filteredLeads.filter(
                (l) => l.status === col.id
              );
              const isHiddenOnMobile = mobileActiveCol !== col.id;

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedLeadId) {
                      updateLeadStatus(draggedLeadId, col.id);
                      setDraggedLeadId(null);
                      showToast(`Consulta movida a "${col.title}"`);
                    }
                  }}
                  className={`${
                    isHiddenOnMobile ? "hidden lg:flex" : "flex"
                  } flex-col bg-white border border-[#E2E8F0] rounded-2xl p-3 shadow-card min-h-[420px]`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#E2E8F0]">
                    <span className="font-heading font-bold text-xs sm:text-sm text-[#0B1B2E]">
                      {col.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${col.badgeClass}`}
                    >
                      {colLeads.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-2.5 flex-1">
                    {colLeads.length === 0 ? (
                      <div className="h-32 rounded-xl border border-dashed border-[#E2E8F0] flex items-center justify-center text-xs text-[#4A5568]">
                        Sin consultas en esta etapa
                      </div>
                    ) : (
                      colLeads.map((lead) => (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={() => setDraggedLeadId(lead.id)}
                          className="bg-[#F5F7FA] hover:bg-white border border-[#E2E8F0] hover:border-[#1473E6] rounded-xl p-3 transition-all cursor-grab active:cursor-grabbing shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div>
                              <p className="font-heading font-bold text-xs sm:text-sm text-[#0B1B2E]">
                                {lead.name}
                              </p>
                              <p className="text-[11px] text-[#4A5568] flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#1473E6]" />
                                {lead.zone} · {lead.origin}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedLead(lead)}
                              className="text-[11px] font-bold text-[#1473E6] hover:underline"
                            >
                              Abrir
                            </button>
                          </div>

                          <div className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-xs mb-2">
                            <p className="font-bold text-[#1473E6] truncate">
                              {lead.serviceName}
                            </p>
                            <p className="font-semibold text-[#0B1B2E] flex items-center gap-1 mt-0.5">
                              <CarFront className="w-3.5 h-3.5 text-[#4A5568]" />
                              {lead.brand} {lead.model} ({lead.year})
                            </p>
                            <p className="text-[11px] text-[#4A5568] truncate mt-0.5">
                              {lead.situation}
                            </p>
                          </div>

                          {/* Quick Stage Switcher & Actions */}
                          <div className="flex items-center justify-between gap-1.5 pt-1">
                            <select
                              aria-label="Cambiar estado de consulta"
                              value={lead.status}
                              onChange={(e) => {
                                updateLeadStatus(
                                  lead.id,
                                  e.target.value as LeadStatus
                                );
                                showToast(
                                  `Estado actualizado a ${e.target.value}`
                                );
                              }}
                              className="px-2 py-1 rounded-md bg-white border border-[#E2E8F0] text-[11px] font-bold text-[#0B1B2E]"
                            >
                              {KANBAN_COLUMNS.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.title}
                                </option>
                              ))}
                            </select>

                            <div className="flex items-center gap-1">
                              <a
                                href={buildTemplateUrl(
                                  lead,
                                  SITE_CONFIG.whatsappTemplates[0].text
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Responder por WhatsApp con plantilla"
                                className="p-1.5 rounded-lg bg-[#1473E6] text-white hover:bg-[#0F5BB8]"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              {!lead.clientId && (
                                <button
                                  type="button"
                                  onClick={() => handleConvert(lead)}
                                  title="Convertir en cliente con 1 clic"
                                  className="p-1.5 rounded-lg bg-[#0B1B2E] text-white hover:bg-[#1473E6]"
                                >
                                  <UserPlus className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* TABLE VIEW */}
      {viewMode === "LIST" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-card overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#4A5568]">
                <th className="py-2.5 pr-3 font-bold">Fecha / Nombre</th>
                <th className="py-2.5 px-3 font-bold">Servicio / Situación</th>
                <th className="py-2.5 px-3 font-bold">Vehículo</th>
                <th className="py-2.5 px-3 font-bold">Estado</th>
                <th className="py-2.5 pl-3 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#F5F7FA]/70">
                  <td className="py-3 pr-3">
                    <p className="font-bold text-[#0B1B2E]">{lead.name}</p>
                    <p className="text-[11px] text-[#4A5568]">
                      {lead.zone} ·{" "}
                      {new Date(lead.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-[#1473E6]">
                      {lead.serviceName}
                    </p>
                    <p className="text-[11px] text-[#4A5568]">
                      {lead.situation}
                    </p>
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#0B1B2E]">
                    {lead.brand} {lead.model} ({lead.year})
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        updateLeadStatus(lead.id, e.target.value as LeadStatus)
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs font-bold text-[#0B1B2E]"
                    >
                      {KANBAN_COLUMNS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pl-3 text-right space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedLead(lead)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] font-bold text-[#0B1B2E] hover:border-[#1473E6]"
                    >
                      Ver / Plantillas
                    </button>
                    {!lead.clientId && (
                      <button
                        type="button"
                        onClick={() => handleConvert(lead)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1473E6] text-white font-bold hover:bg-[#0F5BB8]"
                      >
                        Convertir a Cliente
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LEAD DETAIL & WHATSAPP TEMPLATES MODAL */}
      {liveSelectedLead && (
        <div className="fixed inset-0 z-50 bg-[#0B1B2E]/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-cardHover">
            <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1473E6]">
                  Detalle de Consulta · Origen: {liveSelectedLead.origin}
                </span>
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#0B1B2E]">
                  {liveSelectedLead.name} ({liveSelectedLead.zone})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg text-[#4A5568] hover:bg-[#F5F7FA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                <p className="text-[#4A5568] font-semibold">
                  Vehículo y Servicio
                </p>
                <p className="font-bold text-[#0B1B2E] text-sm mt-0.5">
                  {liveSelectedLead.brand} {liveSelectedLead.model} (
                  {liveSelectedLead.year})
                </p>
                <p className="font-semibold text-[#1473E6] mt-0.5">
                  {liveSelectedLead.serviceName}
                </p>
                <p className="text-[#4A5568] mt-0.5">
                  Situación: {liveSelectedLead.situation}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex flex-col justify-between">
                <div>
                  <p className="text-[#4A5568] font-semibold">
                    Contacto y Horario
                  </p>
                  <p className="font-bold text-[#0B1B2E] text-sm mt-0.5">
                    Tel: {liveSelectedLead.phone || "No especificado"}
                  </p>
                  <p className="text-[#4A5568] mt-0.5">
                    Horario: {liveSelectedLead.preferredSchedule || "A coordinar"}
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  {!liveSelectedLead.clientId ? (
                    <button
                      type="button"
                      onClick={() => handleConvert(liveSelectedLead)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0B1B2E] hover:bg-[#1473E6] text-white font-bold transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Convertir en Cliente (1 clic)</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      Ya convertido en cliente del CRM
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Original Message */}
            <div className="p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-xs sm:text-sm text-[#0B1B2E] mb-4">
              <p className="text-[11px] font-bold uppercase text-[#4A5568] mb-1">
                Mensaje recibido de la web:
              </p>
              <p className="italic">“{liveSelectedLead.message}”</p>
            </div>

            {/* WhatsApp Quick Response Templates */}
            <div className="mb-5">
              <h3 className="font-heading font-bold text-xs sm:text-sm text-[#0B1B2E] mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#1473E6]" />
                <span>Plantillas de respuesta rápida por WhatsApp</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SITE_CONFIG.whatsappTemplates.map((tpl) => (
                  <a
                    key={tpl.id}
                    href={buildTemplateUrl(liveSelectedLead, tpl.text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (liveSelectedLead.status === "NUEVO") {
                        updateLeadStatus(liveSelectedLead.id, "CONTACTADO");
                      }
                    }}
                    className="p-3 rounded-xl bg-white hover:bg-[#F5F7FA] border border-[#E2E8F0] hover:border-[#1473E6] transition-all flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#0B1B2E]">{tpl.title}</p>
                      <p className="text-[11px] text-[#4A5568] line-clamp-1 mt-0.5">
                        {tpl.text}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            {/* Internal Notes */}
            <div className="border-t border-[#E2E8F0] pt-4">
              <h3 className="font-heading font-bold text-xs sm:text-sm text-[#0B1B2E] mb-2">
                Notas de seguimiento ({liveSelectedLead.notes.length})
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Agregar nota (ej: Se pasó presupuesto $78.000, viene mañana)..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-xs text-[#0B1B2E]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!noteInput.trim()) return;
                    addLeadNote(liveSelectedLead.id, noteInput);
                    setNoteInput("");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#1473E6] text-white text-xs font-bold"
                >
                  Guardar
                </button>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {liveSelectedLead.notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-lg bg-[#F5F7FA] text-xs text-[#0B1B2E]"
                  >
                    <p>{n.content}</p>
                    <p className="text-[10px] text-[#4A5568] mt-0.5">
                      {n.author} ·{" "}
                      {new Date(n.createdAt).toLocaleString("es-AR")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  deleteLead(liveSelectedLead.id);
                  setSelectedLead(null);
                  showToast("Consulta eliminada.");
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar consulta</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl bg-[#0B1B2E] text-white text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW MANUAL LEAD MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1B2E]/60 backdrop-blur-xs flex items-center justify-center p-3">
          <form
            onSubmit={handleCreateManualLead}
            className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-cardHover space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#0B1B2E]">
                Registrar Consulta Manual
              </h2>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 text-[#4A5568]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, name: e.target.value })
                  }
                  placeholder="Ej: Lucas Pereyra"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="text"
                  value={newLeadForm.phone}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, phone: e.target.value })
                  }
                  placeholder="11 4567-8901"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Zona
                </label>
                <input
                  type="text"
                  value={newLeadForm.zone}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, zone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Canal de origen
                </label>
                <select
                  value={newLeadForm.origin}
                  onChange={(e) =>
                    setNewLeadForm({
                      ...newLeadForm,
                      origin: e.target.value as
                        | "Web"
                        | "WhatsApp"
                        | "Instagram"
                        | "Local",
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Web">Web</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Local">Mostrador Local</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Servicio consultado
                </label>
                <select
                  value={newLeadForm.serviceName}
                  onChange={(e) =>
                    setNewLeadForm({
                      ...newLeadForm,
                      serviceName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                >
                  {SITE_CONFIG.services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Marca
                </label>
                <select
                  value={newLeadForm.brand}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, brand: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                >
                  {SITE_CONFIG.brands.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Modelo y Año
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={newLeadForm.model}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, model: e.target.value })
                    }
                    placeholder="Modelo"
                    className="px-2.5 py-2 rounded-xl border border-[#E2E8F0]"
                  />
                  <input
                    type="text"
                    value={newLeadForm.year}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, year: e.target.value })
                    }
                    placeholder="Año"
                    className="px-2.5 py-2 rounded-xl border border-[#E2E8F0]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#4A5568]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1473E6] text-white text-xs font-bold"
              >
                Guardar Consulta
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
