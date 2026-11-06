"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  MessageSquare,
  Phone,
  MapPin,
  CarFront,
  Wrench,
  Tag,
  Trash2,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";
import { useKeyCar } from "@/context/KeyCarContext";
import { ClientRecord } from "@/lib/types";
import { SITE_CONFIG } from "@/config/site";

function formatARS(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-AR")}`;
}

export default function AdminClientesPage() {
  const {
    db,
    addClient,
    updateClient,
    deleteClient,
    addClientNote,
    addClientVehicle,
  } = useKeyCar();

  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("TODAS");
  const [tagFilter, setTagFilter] = useState("TODAS");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: "Volkswagen",
    model: "",
    year: 2020,
    plate: "",
  });

  // New Client Form
  const [clientForm, setClientForm] = useState({
    name: "",
    phone: "",
    email: "",
    zone: "Florencio Varela",
    tagsText: "Particular",
    brand: "Volkswagen",
    model: "Gol Trend",
    year: 2019,
    plate: "",
    initialNote: "",
  });

  const filteredClients = useMemo(() => {
    return db.clients.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.zone.toLowerCase().includes(q) ||
        c.vehicles.some(
          (v) =>
            v.brand.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.plate.toLowerCase().includes(q)
        );

      const matchesBrand =
        brandFilter === "TODAS" ||
        c.vehicles.some((v) => v.brand === brandFilter);

      const matchesTag =
        tagFilter === "TODAS" || c.tags.includes(tagFilter);

      return matchesSearch && matchesBrand && matchesTag;
    });
  }, [db.clients, search, brandFilter, tagFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize));
  const paginatedClients = filteredClients.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const selectedClient = useMemo(
    () => db.clients.find((c) => c.id === selectedClientId) || null,
    [db.clients, selectedClientId]
  );

  const clientJobs = useMemo(() => {
    if (!selectedClient) return [];
    return db.jobs.filter((j) => j.clientId === selectedClient.id);
  }, [db.jobs, selectedClient]);

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name.trim() || !clientForm.phone.trim()) return;

    const tags = clientForm.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const created = addClient({
      name: clientForm.name,
      phone: clientForm.phone,
      email: clientForm.email,
      zone: clientForm.zone,
      tags,
      vehicle: clientForm.model.trim()
        ? {
            brand: clientForm.brand,
            model: clientForm.model,
            year: Number(clientForm.year) || 2020,
            plate: clientForm.plate || "S/P",
          }
        : undefined,
      initialNote: clientForm.initialNote,
    });

    setShowCreateModal(false);
    setSelectedClientId(created.id);
    setClientForm({
      name: "",
      phone: "",
      email: "",
      zone: "Florencio Varela",
      tagsText: "Particular",
      brand: "Volkswagen",
      model: "",
      year: 2020,
      plate: "",
      initialNote: "",
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    updateClient(editingClient.id, {
      name: editingClient.name,
      phone: editingClient.phone,
      email: editingClient.email,
      zone: editingClient.zone,
      tags: editingClient.tags,
    });
    setEditingClient(null);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1473E6]">
            Base de Clientes · Historial de Vehículos y Llaves
          </span>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B1B2E]">
            CRM de Clientes ({db.clients.length})
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Alta de Cliente</span>
        </button>
      </div>

      {/* Filters Bar */}
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
            placeholder="Buscar por nombre, teléfono, patente, modelo o zona..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs sm:text-sm text-[#0B1B2E] focus:outline-none focus:ring-2 focus:ring-[#1473E6]"
          />
        </div>
        <div className="sm:col-span-3">
          <select
            value={brandFilter}
            onChange={(e) => {
              setBrandFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs sm:text-sm text-[#0B1B2E] font-medium"
          >
            <option value="TODAS">Todas las marcas</option>
            {SITE_CONFIG.brands.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-3">
          <select
            value={tagFilter}
            onChange={(e) => {
              setTagFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs sm:text-sm text-[#0B1B2E] font-medium"
          >
            <option value="TODAS">Todas las etiquetas</option>
            <option value="Particular">Particular</option>
            <option value="Frecuente">Frecuente</option>
            <option value="Urgencia 24hs">Urgencia 24hs</option>
            <option value="Flota Comercial">Flota Comercial</option>
            <option value="Agencia Automotor">Agencia Automotor</option>
            <option value="Taller Mecánico Aliado">
              Taller Mecánico Aliado
            </option>
          </select>
        </div>
      </div>

      {/* Clients Table / Cards */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-[#E2E8F0] text-[#4A5568]">
                <th className="py-3 px-4 font-bold">Cliente / Zona</th>
                <th className="py-3 px-3 font-bold">Teléfono / WhatsApp</th>
                <th className="py-3 px-3 font-bold">Vehículos Registrados</th>
                <th className="py-3 px-3 font-bold">Etiquetas</th>
                <th className="py-3 px-3 font-bold">Total Gastado</th>
                <th className="py-3 px-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {paginatedClients.map((client) => (
                <tr key={client.id} className="hover:bg-[#F5F7FA]/70">
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => setSelectedClientId(client.id)}
                      className="font-heading font-bold text-sm text-[#0B1B2E] hover:text-[#1473E6] text-left"
                    >
                      {client.name}
                    </button>
                    <p className="text-[11px] text-[#4A5568] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#1473E6]" />
                      {client.zone}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-[#0B1B2E]">
                      {client.phone}
                    </p>
                    <a
                      href={`https://wa.me/${client.whatsapp}?text=${encodeURIComponent(
                        `Hola ${client.name}! Te escribimos de KeyCar Cerrajería Automotriz.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1473E6] hover:underline mt-0.5"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Abrir WhatsApp
                    </a>
                  </td>
                  <td className="py-3 px-3">
                    {client.vehicles.map((v) => (
                      <div
                        key={v.id}
                        className="inline-flex items-center gap-1.5 mr-1.5 mb-1 px-2 py-1 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0]"
                      >
                        <CarFront className="w-3.5 h-3.5 text-[#1473E6]" />
                        <span className="font-bold text-[#0B1B2E]">
                          {v.brand} {v.model} ({v.year})
                        </span>
                        <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-[#E2E8F0]">
                          {v.plate}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {client.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F5F7FA] text-[#4A5568] border border-[#E2E8F0]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-heading font-bold text-sm text-[#0B1B2E]">
                      {formatARS(client.totalSpent)}
                    </p>
                    <p className="text-[11px] text-[#4A5568]">
                      {client.jobsCount} trabajos
                    </p>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedClientId(client.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#0B1B2E] hover:bg-[#1473E6] text-white font-bold transition-colors"
                    >
                      Ver Ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Compact Cards (No lateral overflow, dense horizontal layout) */}
        <div className="md:hidden divide-y divide-[#E2E8F0]">
          {paginatedClients.map((client) => {
            const mainVeh = client.vehicles[0];
            return (
              <div key={client.id} className="p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <button
                      type="button"
                      onClick={() => setSelectedClientId(client.id)}
                      className="font-heading font-bold text-sm text-[#0B1B2E] text-left"
                    >
                      {client.name}
                    </button>
                    <p className="text-[11px] text-[#4A5568]">
                      {client.zone} · {client.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-xs text-[#0B1B2E]">
                      {formatARS(client.totalSpent)}
                    </p>
                    <p className="text-[10px] text-[#4A5568]">
                      {client.jobsCount} trab.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  {mainVeh ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs font-semibold text-[#0B1B2E] truncate">
                      <CarFront className="w-3.5 h-3.5 text-[#1473E6] flex-shrink-0" />
                      {mainVeh.brand} {mainVeh.model} ({mainVeh.plate})
                    </span>
                  ) : (
                    <span className="text-xs text-[#4A5568]">Sin vehículo</span>
                  )}

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <a
                      href={`https://wa.me/${client.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#1473E6] text-white"
                      aria-label="WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setSelectedClientId(client.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0B1B2E] text-white text-xs font-bold"
                    >
                      Ficha
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Footer & "Ver más" */}
        <div className="px-4 py-3 bg-[#F5F7FA] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#4A5568]">
              Mostrando <strong>{paginatedClients.length}</strong> de{" "}
              <strong>{filteredClients.length}</strong> clientes
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <button
              type="button"
              onClick={() => {
                setPageSize((prev) => (prev <= 5 ? 15 : 5));
                setPage(1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-white hover:bg-[#1473E6] text-[#0B1B2E] hover:text-white border border-[#E2E8F0] transition-colors"
            >
              {pageSize <= 5 ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-[#1473E6]" />
                  <span>Ver más clientes (15)</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-[#1473E6]" />
                  <span>Ver menos (5 filas)</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#4A5568] mr-1">
              Página {page} de {totalPages}
            </span>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
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

      {/* CLIENT FULL FICHA MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-[#0B1B2E]/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-cardHover">
            <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-[#E2E8F0]">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#0B1B2E]">
                    {selectedClient.name}
                  </h2>
                  {selectedClient.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F5F7FA] text-[#1473E6] border border-[#E2E8F0]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[#4A5568] mt-0.5">
                  {selectedClient.zone} · Tel: {selectedClient.phone}{" "}
                  {selectedClient.email ? `· ${selectedClient.email}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClientId(null)}
                className="p-1.5 rounded-lg text-[#4A5568] hover:bg-[#F5F7FA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Quick KPIs & Direct WhatsApp */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                <span className="text-[#4A5568]">Total Gastado</span>
                <p className="font-heading font-extrabold text-base text-[#0B1B2E] mt-0.5">
                  {formatARS(selectedClient.totalSpent)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                <span className="text-[#4A5568]">Trabajos Realizados</span>
                <p className="font-heading font-extrabold text-base text-[#0B1B2E] mt-0.5">
                  {clientJobs.length} servicios
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                <span className="text-[#4A5568]">Última Visita</span>
                <p className="font-bold text-[#0B1B2E] mt-1">
                  {selectedClient.lastVisit
                    ? new Date(selectedClient.lastVisit).toLocaleDateString(
                        "es-AR"
                      )
                    : "Sin visitas"}
                </p>
              </div>
              <a
                href={`https://wa.me/${selectedClient.whatsapp}?text=${encodeURIComponent(
                  `Hola ${selectedClient.name}! Te escribimos de KeyCar Cerrajería Automotriz (Av. Gral. San Martín 1574).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#1473E6] hover:bg-[#0F5BB8] text-white flex flex-col justify-center items-center font-bold transition-colors"
              >
                <MessageSquare className="w-4 h-4 mb-1" />
                <span>WhatsApp Directo</span>
              </a>
            </div>

            {/* Vehicles Section */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading font-bold text-xs sm:text-sm text-[#0B1B2E] flex items-center gap-1.5">
                  <CarFront className="w-4 h-4 text-[#1473E6]" />
                  <span>
                    Vehículos del Cliente ({selectedClient.vehicles.length})
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddVehicle(!showAddVehicle)}
                  className="text-xs font-bold text-[#1473E6] hover:underline"
                >
                  + Agregar vehículo
                </button>
              </div>

              {showAddVehicle && (
                <div className="mb-3 p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <select
                    value={newVehicle.brand}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, brand: e.target.value })
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0]"
                  >
                    {SITE_CONFIG.brands.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Modelo (ej: Cronos)"
                    value={newVehicle.model}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, model: e.target.value })
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0]"
                  />
                  <input
                    type="number"
                    placeholder="Año"
                    value={newVehicle.year}
                    onChange={(e) =>
                      setNewVehicle({
                        ...newVehicle,
                        year: Number(e.target.value),
                      })
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0]"
                  />
                  <input
                    type="text"
                    placeholder="Patente (ej: AF 123 JK)"
                    value={newVehicle.plate}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, plate: e.target.value })
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newVehicle.model.trim()) return;
                      addClientVehicle(selectedClient.id, {
                        brand: newVehicle.brand,
                        model: newVehicle.model,
                        year: newVehicle.year || 2020,
                        plate: newVehicle.plate || "S/P",
                      });
                      setNewVehicle({
                        brand: "Volkswagen",
                        model: "",
                        year: 2020,
                        plate: "",
                      });
                      setShowAddVehicle(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#1473E6] text-white font-bold"
                  >
                    Guardar
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedClient.vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#0B1B2E]">
                        {v.brand} {v.model} ({v.year})
                      </p>
                      <p className="text-[11px] text-[#4A5568]">
                        Dominio / Patente: <strong>{v.plate}</strong>
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded bg-white border border-[#E2E8F0] font-mono font-bold text-[#0B1B2E]">
                      {v.plate}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Job History Section */}
            <div className="mb-5">
              <h3 className="font-heading font-bold text-xs sm:text-sm text-[#0B1B2E] mb-2 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-[#1473E6]" />
                <span>Historial de Trabajos ({clientJobs.length})</span>
              </h3>
              {clientJobs.length === 0 ? (
                <p className="text-xs text-[#4A5568] italic">
                  Este cliente aún no registra trabajos en el taller.
                </p>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {clientJobs.map((j) => (
                    <div
                      key={j.id}
                      className="p-2.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#0B1B2E]">
                          {j.code} · {j.serviceName}
                        </p>
                        <p className="text-[11px] text-[#4A5568]">
                          {j.brand} {j.model} ·{" "}
                          {new Date(j.date).toLocaleDateString("es-AR")} ·{" "}
                          {j.technician}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#1473E6]">
                          {formatARS(j.priceCharged)}
                        </p>
                        <span className="text-[10px] font-semibold text-[#4A5568]">
                          {j.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="border-t border-[#E2E8F0] pt-4">
              <h3 className="font-heading font-bold text-xs sm:text-sm text-[#0B1B2E] mb-2">
                Notas Técnicas e Historial ({selectedClient.notes.length})
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Agregar nota técnica (ej: PIN code inmovilizador, tipo de chip)..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-xs text-[#0B1B2E]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!noteInput.trim()) return;
                    addClientNote(selectedClient.id, noteInput);
                    setNoteInput("");
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1473E6] text-white text-xs font-bold"
                >
                  Agregar
                </button>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {selectedClient.notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-lg bg-[#F5F7FA] text-xs text-[#0B1B2E]"
                  >
                    <p>{n.content}</p>
                    <p className="text-[10px] text-[#4A5568] mt-0.5">
                      {n.author} ·{" "}
                      {new Date(n.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-5 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingClient(selectedClient)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1473E6] hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar datos</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteClient(selectedClient.id);
                    setSelectedClientId(null);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Dar de baja</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClientId(null)}
                className="px-4 py-2 rounded-xl bg-[#0B1B2E] text-white text-xs font-bold"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CLIENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1B2E]/60 backdrop-blur-xs flex items-center justify-center p-3">
          <form
            onSubmit={handleCreateClient}
            className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-cardHover space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#0B1B2E]">
                Alta de Nuevo Cliente
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-[#4A5568]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={clientForm.name}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, name: e.target.value })
                  }
                  placeholder="Ej: Mariano Gómez"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={clientForm.phone}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, phone: e.target.value })
                  }
                  placeholder="11 4567-8900"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Zona / Localidad
                </label>
                <input
                  type="text"
                  value={clientForm.zone}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, zone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Etiquetas (separadas por coma)
                </label>
                <input
                  type="text"
                  value={clientForm.tagsText}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, tagsText: e.target.value })
                  }
                  placeholder="Particular, Frecuente"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] space-y-2 text-xs">
              <p className="font-bold text-[#0B1B2E]">
                Vehículo principal del cliente
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <select
                  value={clientForm.brand}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, brand: e.target.value })
                  }
                  className="px-2.5 py-2 rounded-lg bg-white border border-[#E2E8F0]"
                >
                  {SITE_CONFIG.brands.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={clientForm.model}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, model: e.target.value })
                  }
                  placeholder="Modelo"
                  className="px-2.5 py-2 rounded-lg bg-white border border-[#E2E8F0]"
                />
                <input
                  type="number"
                  value={clientForm.year}
                  onChange={(e) =>
                    setClientForm({
                      ...clientForm,
                      year: Number(e.target.value),
                    })
                  }
                  placeholder="Año"
                  className="px-2.5 py-2 rounded-lg bg-white border border-[#E2E8F0]"
                />
                <input
                  type="text"
                  value={clientForm.plate}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, plate: e.target.value })
                  }
                  placeholder="Patente"
                  className="px-2.5 py-2 rounded-lg bg-white border border-[#E2E8F0]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#4A5568]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1473E6] text-white text-xs font-bold"
              >
                Crear Cliente
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT CLIENT MODAL */}
      {editingClient && (
        <div className="fixed inset-0 z-50 bg-[#0B1B2E]/60 backdrop-blur-xs flex items-center justify-center p-3">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-cardHover space-y-3 text-xs"
          >
            <h2 className="font-heading font-extrabold text-base text-[#0B1B2E]">
              Editar Cliente
            </h2>
            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Nombre
              </label>
              <input
                type="text"
                required
                value={editingClient.name}
                onChange={(e) =>
                  setEditingClient({ ...editingClient, name: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Teléfono
              </label>
              <input
                type="text"
                required
                value={editingClient.phone}
                onChange={(e) =>
                  setEditingClient({ ...editingClient, phone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Zona
              </label>
              <input
                type="text"
                value={editingClient.zone}
                onChange={(e) =>
                  setEditingClient({ ...editingClient, zone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingClient(null)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1473E6] text-white font-bold"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

