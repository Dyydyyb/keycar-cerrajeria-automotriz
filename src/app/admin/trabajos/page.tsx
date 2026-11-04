"use client";

import React, { useState, useMemo } from "react";
import {
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  CarFront,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useKeyCar } from "@/context/KeyCarContext";
import { JobStatus, PaymentMethod } from "@/lib/types";
import { SITE_CONFIG } from "@/config/site";

function formatARS(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-AR")}`;
}

export default function AdminTrabajosPage() {
  const { db, addJob, updateJobStatus, deleteJob } = useKeyCar();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [serviceFilter, setServiceFilter] = useState<string>("TODOS");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [jobForm, setJobForm] = useState({
    clientId: db.clients[0]?.id || "",
    serviceId: SITE_CONFIG.services[0].id,
    brand: db.clients[0]?.vehicles[0]?.brand || "Volkswagen",
    model: db.clients[0]?.vehicles[0]?.model || "Gol Trend",
    year: db.clients[0]?.vehicles[0]?.year || 2019,
    plate: db.clients[0]?.vehicles[0]?.plate || "AF 123 JK",
    date: new Date().toISOString().slice(0, 10),
    priceCharged: SITE_CONFIG.services[0].basePrice,
    materialCost: SITE_CONFIG.services[0].materialCostEstimate,
    paymentMethod: "TRANSFERENCIA" as PaymentMethod,
    status: "COBRADO" as JobStatus,
    technician: db.settings.technicians[0] || "Lucas (Taller Principal)",
    notes: "",
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3800);
  };

  const handleClientSelectInForm = (clientId: string) => {
    const client = db.clients.find((c) => c.id === clientId);
    const veh = client?.vehicles[0];
    setJobForm((prev) => ({
      ...prev,
      clientId,
      brand: veh ? veh.brand : prev.brand,
      model: veh ? veh.model : prev.model,
      year: veh ? veh.year : prev.year,
      plate: veh ? veh.plate : prev.plate,
    }));
  };

  const handleServiceSelectInForm = (serviceId: string) => {
    const srv = SITE_CONFIG.services.find((s) => s.id === serviceId);
    setJobForm((prev) => ({
      ...prev,
      serviceId,
      priceCharged: srv ? srv.basePrice : prev.priceCharged,
      materialCost: srv ? srv.materialCostEstimate : prev.materialCost,
    }));
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addJob(jobForm);
    setShowCreateModal(false);
    if (created.status === "COBRADO") {
      showToast(
        `Trabajo ${created.code} registrado y cobrado. Se generó automáticamente el ingreso de ${formatARS(
          created.priceCharged
        )} en Finanzas.`
      );
    } else {
      showToast(`Trabajo ${created.code} registrado con estado ${created.status}.`);
    }
  };

  const handleStatusChange = (jobId: string, code: string, newStatus: JobStatus) => {
    updateJobStatus(jobId, newStatus);
    if (newStatus === "COBRADO") {
      showToast(
        `¡Trabajo ${code} marcado como COBRADO! Ingreso generado automáticamente en Finanzas.`
      );
    } else {
      showToast(`Estado de ${code} actualizado a ${newStatus}.`);
    }
  };

  const filteredJobs = useMemo(() => {
    return db.jobs.filter((j) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        j.code.toLowerCase().includes(q) ||
        j.clientName.toLowerCase().includes(q) ||
        j.brand.toLowerCase().includes(q) ||
        j.model.toLowerCase().includes(q) ||
        j.plate.toLowerCase().includes(q) ||
        j.serviceName.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "TODOS" || j.status === statusFilter;
      const matchesService =
        serviceFilter === "TODOS" || j.serviceId === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [db.jobs, search, statusFilter, serviceFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const statusCounts = useMemo(() => {
    return {
      PENDIENTE: db.jobs.filter((j) => j.status === "PENDIENTE").length,
      EN_PROCESO: db.jobs.filter((j) => j.status === "EN_PROCESO").length,
      FINALIZADO: db.jobs.filter((j) => j.status === "FINALIZADO").length,
      COBRADO: db.jobs.filter((j) => j.status === "COBRADO").length,
    };
  }, [db.jobs]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0B1B2E] text-white px-4 py-3 rounded-xl shadow-cardHover border border-white/15 flex items-center gap-2.5 text-xs sm:text-sm font-semibold max-w-md">
          <CheckCircle2 className="w-4 h-4 text-[#25D366] flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1473E6]">
            Órdenes de Taller · Sincronización Automática con Finanzas
          </span>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B1B2E]">
            Trabajos y Servicios Realizados ({db.jobs.length})
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Trabajo</span>
        </button>
      </div>

      {/* Quick Status Strip (2x2 on mobile, 4 cols on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {[
          { id: "PENDIENTE", label: "Pendientes", count: statusCounts.PENDIENTE },
          { id: "EN_PROCESO", label: "En Proceso", count: statusCounts.EN_PROCESO },
          { id: "FINALIZADO", label: "Finalizados", count: statusCounts.FINALIZADO },
          { id: "COBRADO", label: "Cobrados (En Caja)", count: statusCounts.COBRADO },
        ].map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => {
              setStatusFilter(statusFilter === st.id ? "TODOS" : st.id);
              setPage(1);
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
              statusFilter === st.id
                ? "bg-[#0B1B2E] text-white border-[#0B1B2E]"
                : "bg-white text-[#0B1B2E] border-[#E2E8F0] hover:border-[#1473E6]"
            }`}
          >
            <span className="text-xs font-bold">{st.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                statusFilter === st.id
                  ? "bg-[#1473E6] text-white"
                  : "bg-[#F5F7FA] text-[#1473E6]"
              }`}
            >
              {st.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-[#4A5568] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por código (KC-...), cliente, vehículo o patente..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs sm:text-sm text-[#0B1B2E]"
          />
        </div>
        <div className="sm:col-span-3">
          <select
            value={serviceFilter}
            onChange={(e) => {
              setServiceFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs sm:text-sm text-[#0B1B2E] font-medium"
          >
            <option value="TODOS">Todos los servicios</option>
            {SITE_CONFIG.services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shortTitle}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs sm:text-sm text-[#0B1B2E] font-medium"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_PROCESO">En proceso</option>
            <option value="FINALIZADO">Finalizado</option>
            <option value="COBRADO">Cobrado</option>
          </select>
        </div>
      </div>

      {/* Table / Mobile Cards */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-[#E2E8F0] text-[#4A5568]">
                <th className="py-3 px-4 font-bold">Orden / Fecha</th>
                <th className="py-3 px-3 font-bold">Cliente</th>
                <th className="py-3 px-3 font-bold">Vehículo</th>
                <th className="py-3 px-3 font-bold">Servicio / Técnico</th>
                <th className="py-3 px-3 font-bold">Precio / Costo / Pago</th>
                <th className="py-3 px-4 font-bold text-right">
                  Estado (Genera Ingreso)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {paginatedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#F5F7FA]/70">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#0B1B2E]">
                      {job.code}
                    </span>
                    <p className="text-[11px] text-[#4A5568]">
                      {new Date(job.date).toLocaleDateString("es-AR")}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-[#0B1B2E]">{job.clientName}</p>
                    <p className="text-[11px] text-[#4A5568]">
                      {job.clientPhone}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-[#0B1B2E]">
                      {job.brand} {job.model} ({job.year})
                    </p>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#F5F7FA] border border-[#E2E8F0] rounded">
                      {job.plate}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-[#1473E6]">
                      {job.serviceName}
                    </p>
                    <p className="text-[11px] text-[#4A5568]">
                      {job.technician}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-heading font-bold text-sm text-[#0B1B2E]">
                      {formatARS(job.priceCharged)}
                    </p>
                    <p className="text-[11px] text-[#4A5568]">
                      Mat: {formatARS(job.materialCost)} · {job.paymentMethod}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <select
                        value={job.status}
                        onChange={(e) =>
                          handleStatusChange(
                            job.id,
                            job.code,
                            e.target.value as JobStatus
                          )
                        }
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border ${
                          job.status === "COBRADO"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : job.status === "FINALIZADO"
                            ? "bg-blue-50 text-[#1473E6] border-blue-200"
                            : job.status === "EN_PROCESO"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="EN_PROCESO">En proceso</option>
                        <option value="FINALIZADO">Finalizado</option>
                        <option value="COBRADO">Cobrado ✓</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => deleteJob(job.id)}
                        title="Eliminar trabajo"
                        className="p-1.5 text-[#4A5568] hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Compact Cards */}
        <div className="md:hidden divide-y divide-[#E2E8F0]">
          {paginatedJobs.map((job) => (
            <div key={job.id} className="p-3.5 space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-[#1473E6]">
                    {job.code}
                  </span>{" "}
                  ·{" "}
                  <span className="font-bold text-[#0B1B2E]">
                    {job.clientName}
                  </span>
                  <p className="text-[11px] text-[#4A5568]">
                    {job.brand} {job.model} ({job.plate}) ·{" "}
                    {new Date(job.date).toLocaleDateString("es-AR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-extrabold text-sm text-[#0B1B2E]">
                    {formatARS(job.priceCharged)}
                  </p>
                  <p className="text-[10px] text-[#4A5568]">
                    {job.paymentMethod}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[#0B1B2E] truncate">
                  {job.serviceName}
                </span>
                <select
                  value={job.status}
                  onChange={(e) =>
                    handleStatusChange(
                      job.id,
                      job.code,
                      e.target.value as JobStatus
                    )
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    job.status === "COBRADO"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-[#F5F7FA] text-[#0B1B2E] border-[#E2E8F0]"
                  }`}
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROCESO">En proceso</option>
                  <option value="FINALIZADO">Finalizado</option>
                  <option value="COBRADO">Cobrado ✓</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 bg-[#F5F7FA] border-t border-[#E2E8F0] flex items-center justify-between text-xs">
          <span className="text-[#4A5568]">
            Mostrando <strong>{paginatedJobs.length}</strong> de{" "}
            <strong>{filteredJobs.length}</strong> trabajos
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-[#0B1B2E]">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CREATE NEW JOB MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1B2E]/60 backdrop-blur-xs flex items-center justify-center p-3">
          <form
            onSubmit={handleCreateJob}
            className="bg-white border border-[#E2E8F0] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-cardHover space-y-3 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <div>
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#0B1B2E]">
                  Registrar Nuevo Trabajo
                </h2>
                <p className="text-[11px] text-[#4A5568]">
                  Si el estado es &ldquo;Cobrado&rdquo;, se registrará
                  automáticamente el ingreso en Finanzas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-[#4A5568]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Cliente *
                </label>
                <select
                  value={jobForm.clientId}
                  onChange={(e) => handleClientSelectInForm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                >
                  {db.clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.zone})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Tipo de Servicio *
                </label>
                <select
                  value={jobForm.serviceId}
                  onChange={(e) => handleServiceSelectInForm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                >
                  {SITE_CONFIG.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Marca
                </label>
                <select
                  value={jobForm.brand}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, brand: e.target.value })
                  }
                  className="w-full px-2.5 py-2 rounded-xl border border-[#E2E8F0]"
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
                  Modelo
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.model}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, model: e.target.value })
                  }
                  className="w-full px-2.5 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Año
                </label>
                <input
                  type="number"
                  value={jobForm.year}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, year: Number(e.target.value) })
                  }
                  className="w-full px-2.5 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Patente
                </label>
                <input
                  type="text"
                  value={jobForm.plate}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, plate: e.target.value })
                  }
                  className="w-full px-2.5 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Precio Cobrado ($) *
                </label>
                <input
                  type="number"
                  required
                  value={jobForm.priceCharged}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      priceCharged: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Costo Materiales ($)
                </label>
                <input
                  type="number"
                  value={jobForm.materialCost}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      materialCost: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Método de Pago
                </label>
                <select
                  value={jobForm.paymentMethod}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      paymentMethod: e.target.value as PaymentMethod,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                >
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                  <option value="MERCADOPAGO">MercadoPago</option>
                  <option value="TARJETA">Tarjeta</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Estado
                </label>
                <select
                  value={jobForm.status}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      status: e.target.value as JobStatus,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] font-bold"
                >
                  <option value="COBRADO">Cobrado (Genera Ingreso)</option>
                  <option value="FINALIZADO">Finalizado</option>
                  <option value="EN_PROCESO">En proceso</option>
                  <option value="PENDIENTE">Pendiente</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Técnico
                </label>
                <select
                  value={jobForm.technician}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, technician: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                >
                  {db.settings.technicians.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={jobForm.date}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, date: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Notas del trabajo (opcional)
              </label>
              <input
                type="text"
                value={jobForm.notes}
                onChange={(e) =>
                  setJobForm({ ...jobForm, notes: e.target.value })
                }
                placeholder="Ej: Llave navaja codificada ID48 + tallado de espada..."
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] font-bold text-[#4A5568]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#1473E6] hover:bg-[#0F5BB8] text-white font-bold"
              >
                Guardar Trabajo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
