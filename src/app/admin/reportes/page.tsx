"use client";

import React, { useMemo, useState } from "react";
import {
  FileSpreadsheet,
  Printer,
  Download,
  Users,
  Wrench,
  Wallet,
  Calendar,
} from "lucide-react";
import { useKeyCar } from "@/context/KeyCarContext";
import { Logo } from "@/components/ui/Logo";

function formatARS(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-AR")}`;
}

function downloadCsvFile(filename: string, headers: string[], rows: string[][]) {
  const escapeCell = (val: string) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  const csvContent = [
    headers.map(escapeCell).join(","),
    ...rows.map((r) => r.map(escapeCell).join(",")),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AdminReportesPage() {
  const { db } = useKeyCar();
  const [selectedMonthDays, setSelectedMonthDays] = useState(30);

  const reportData = useMemo(() => {
    const cutoff = Date.now() - selectedMonthDays * 86400000;
    const jobs = db.jobs.filter((j) => new Date(j.date).getTime() >= cutoff);
    const tx = db.transactions.filter(
      (t) => new Date(t.date).getTime() >= cutoff
    );

    const ingresos = tx
      .filter((t) => t.type === "INGRESO")
      .reduce((a, t) => a + t.amount, 0);
    const egresos = tx
      .filter((t) => t.type === "EGRESO")
      .reduce((a, t) => a + t.amount, 0);

    const srvMap = new Map<string, { count: number; total: number }>();
    for (const j of jobs) {
      const curr = srvMap.get(j.serviceName) || { count: 0, total: 0 };
      curr.count += 1;
      curr.total += j.priceCharged;
      srvMap.set(j.serviceName, curr);
    }

    const byService = Array.from(srvMap.entries())
      .map(([service, data]) => ({ service, ...data }))
      .sort((a, b) => b.total - a.total);

    return {
      jobs,
      tx,
      ingresos,
      egresos,
      balance: ingresos - egresos,
      byService,
    };
  }, [db.jobs, db.transactions, selectedMonthDays]);

  const handleExportClientsCsv = () => {
    downloadCsvFile(
      `keycar_clientes_${new Date().toISOString().slice(0, 10)}.csv`,
      [
        "ID",
        "Nombre",
        "Teléfono",
        "WhatsApp",
        "Zona",
        "Vehículos",
        "Etiquetas",
        "Trabajos",
        "Total Gastado ($)",
      ],
      db.clients.map((c) => [
        c.id,
        c.name,
        c.phone,
        c.whatsapp,
        c.zone,
        c.vehicles
          .map((v) => `${v.brand} ${v.model} (${v.year} - ${v.plate})`)
          .join(" / "),
        c.tags.join(", "),
        String(c.jobsCount),
        String(c.totalSpent),
      ])
    );
  };

  const handleExportJobsCsv = () => {
    downloadCsvFile(
      `keycar_trabajos_${new Date().toISOString().slice(0, 10)}.csv`,
      [
        "Código",
        "Fecha",
        "Cliente",
        "Teléfono",
        "Servicio",
        "Marca",
        "Modelo",
        "Año",
        "Patente",
        "Precio Cobrado ($)",
        "Costo Materiales ($)",
        "Método de Pago",
        "Estado",
        "Técnico",
      ],
      db.jobs.map((j) => [
        j.code,
        new Date(j.date).toLocaleDateString("es-AR"),
        j.clientName,
        j.clientPhone,
        j.serviceName,
        j.brand,
        j.model,
        String(j.year),
        j.plate,
        String(j.priceCharged),
        String(j.materialCost),
        j.paymentMethod,
        j.status,
        j.technician,
      ])
    );
  };

  const handleExportFinancesCsv = () => {
    downloadCsvFile(
      `keycar_finanzas_${new Date().toISOString().slice(0, 10)}.csv`,
      [
        "ID",
        "Fecha",
        "Tipo",
        "Categoría",
        "Descripción",
        "Monto ($)",
        "Método de Pago",
        "Proveedor",
      ],
      db.transactions.map((t) => [
        t.id,
        new Date(t.date).toLocaleDateString("es-AR"),
        t.type,
        t.category,
        t.description,
        String(t.amount),
        t.paymentMethod,
        t.provider || "-",
      ])
    );
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Action Header (hidden when printing) */}
      <div className="no-print bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1473E6]">
            Exportación de Datos y Cierre Contable
          </span>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B1B2E]">
            Reportes y Exportación (CSV / PDF)
          </h1>
        </div>
        <button
          type="button"
          onClick={handlePrintPdf}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8] transition-colors self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Guardar Reporte en PDF</span>
        </button>
      </div>

      {/* 3 CSV Export Cards (hidden when printing) */}
      <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-card flex flex-col justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-[#1473E6] flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-[#0B1B2E]">
                Base de Clientes ({db.clients.length})
              </h2>
              <p className="text-xs text-[#4A5568] mt-0.5">
                Exportar padrón completo con vehículos, patentes y gasto
                acumulado.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportClientsCsv}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#F5F7FA] hover:bg-[#1473E6] text-[#0B1B2E] hover:text-white border border-[#E2E8F0] text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar CSV Clientes</span>
          </button>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-card flex flex-col justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-[#1473E6] flex items-center justify-center flex-shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-[#0B1B2E]">
                Historial de Trabajos ({db.jobs.length})
              </h2>
              <p className="text-xs text-[#4A5568] mt-0.5">
                Órdenes de trabajo, servicios, vehículos, técnicos y montos
                cobrados.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportJobsCsv}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#F5F7FA] hover:bg-[#1473E6] text-[#0B1B2E] hover:text-white border border-[#E2E8F0] text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar CSV Trabajos</span>
          </button>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-card flex flex-col justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-[#1473E6] flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-[#0B1B2E]">
                Movimientos Financieros ({db.transactions.length})
              </h2>
              <p className="text-xs text-[#4A5568] mt-0.5">
                Libro diario de ingresos y egresos por categoría y método de
                pago.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportFinancesCsv}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#F5F7FA] hover:bg-[#1473E6] text-[#0B1B2E] hover:text-white border border-[#E2E8F0] text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar CSV Finanzas</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE / PDF MONTHLY EXECUTIVE REPORT */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
          <Logo variant="light" size="md" href={undefined} />
          <div className="sm:text-right">
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#0B1B2E]">
              Reporte Ejecutivo de Gestión
            </h2>
            <p className="text-xs text-[#4A5568]">
              Av. Gral. San Martín 1574, Florencio Varela · Emitido el{" "}
              {new Date().toLocaleDateString("es-AR")}
            </p>
            <div className="no-print mt-2 inline-flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#1473E6]" />
              <select
                value={selectedMonthDays}
                onChange={(e) => setSelectedMonthDays(Number(e.target.value))}
                className="px-2.5 py-1 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs font-bold text-[#0B1B2E]"
              >
                <option value={30}>Período: Últimos 30 días (Mensual)</option>
                <option value={90}>Período: Últimos 90 días (Trimestral)</option>
                <option value={365}>Período: Últimos 12 meses (Anual)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary KPIs in Printable Report */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
            <span className="text-xs text-[#4A5568]">Trabajos del Período</span>
            <p className="font-heading font-extrabold text-lg text-[#0B1B2E] mt-0.5">
              {reportData.jobs.length} órdenes
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
            <span className="text-xs text-[#4A5568]">Total Ingresos</span>
            <p className="font-heading font-extrabold text-lg text-[#0B1B2E] mt-0.5">
              {formatARS(reportData.ingresos)}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
            <span className="text-xs text-[#4A5568]">Total Egresos</span>
            <p className="font-heading font-extrabold text-lg text-[#0B1B2E] mt-0.5">
              {formatARS(reportData.egresos)}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
            <span className="text-xs text-[#4A5568]">Resultado Neto</span>
            <p
              className={`font-heading font-extrabold text-lg mt-0.5 ${
                reportData.balance >= 0 ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {formatARS(reportData.balance)}
            </p>
          </div>
        </div>

        {/* Breakdown by Service Type */}
        <div>
          <h3 className="font-heading font-bold text-sm text-[#0B1B2E] mb-2.5">
            Facturación y Volumen por Tipo de Servicio
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F7FA] border-y border-[#E2E8F0] text-[#4A5568]">
                  <th className="py-2 px-3 font-bold">Servicio Especializado</th>
                  <th className="py-2 px-3 font-bold">Cantidad de Trabajos</th>
                  <th className="py-2 px-3 font-bold text-right">
                    Facturación Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {reportData.byService.map((row) => (
                  <tr key={row.service}>
                    <td className="py-2 px-3 font-bold text-[#0B1B2E]">
                      {row.service}
                    </td>
                    <td className="py-2 px-3 text-[#4A5568]">
                      {row.count} trabajos
                    </td>
                    <td className="py-2 px-3 font-bold text-[#0B1B2E] text-right">
                      {formatARS(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Movements Summary for Print */}
        <div>
          <h3 className="font-heading font-bold text-sm text-[#0B1B2E] mb-2.5">
            Detalle de Últimos Movimientos del Período
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F7FA] border-y border-[#E2E8F0] text-[#4A5568]">
                  <th className="py-2 px-3 font-bold">Fecha</th>
                  <th className="py-2 px-3 font-bold">Tipo</th>
                  <th className="py-2 px-3 font-bold">Categoría / Detalle</th>
                  <th className="py-2 px-3 font-bold">Medio</th>
                  <th className="py-2 px-3 font-bold text-right">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {reportData.tx.slice(0, 15).map((t) => (
                  <tr key={t.id}>
                    <td className="py-2 px-3 text-[#4A5568]">
                      {new Date(t.date).toLocaleDateString("es-AR")}
                    </td>
                    <td className="py-2 px-3 font-bold text-[#0B1B2E]">
                      {t.type}
                    </td>
                    <td className="py-2 px-3 text-[#0B1B2E]">
                      <strong>{t.category}:</strong> {t.description}
                    </td>
                    <td className="py-2 px-3 text-[#4A5568]">
                      {t.paymentMethod}
                    </td>
                    <td className="py-2 px-3 font-bold text-[#0B1B2E] text-right">
                      {t.type === "INGRESO" ? "+" : "-"}
                      {formatARS(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
