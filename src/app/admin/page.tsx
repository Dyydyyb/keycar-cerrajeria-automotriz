"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
} from "recharts";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  MessageSquareMore,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Wrench,
  Plus,
  CarFront,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useKeyCar } from "@/context/KeyCarContext";

type PeriodFilter = "HOY" | "SEMANA" | "MES" | "ANIO" | "CUSTOM";

function formatARS(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-AR")}`;
}

function calcPercentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function formatNetAxis(v: number): string {
  if (v === 0) return "$0";
  const sign = v < 0 ? "-" : "+";
  const abs = Math.abs(v);
  if (abs >= 1000000) return `${sign}$${(abs / 1000000).toFixed(1)}M`;
  return `${sign}$${Math.round(abs / 1000)}k`;
}

export default function AdminDashboardPage() {
  const { db, isLoaded } = useKeyCar();

  const [period, setPeriod] = useState<PeriodFilter>("MES");
  const [jobsLimit, setJobsLimit] = useState(4);
  const [leadsLimit, setLeadsLimit] = useState(4);
  const [customStart, setCustomStart] = useState<string>(() => {
    const d = new Date(Date.now() - 30 * 86400000);
    return d.toISOString().slice(0, 10);
  });
  const [customEnd, setCustomEnd] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [serviceMetricMode, setServiceMetricMode] = useState<
    "CANTIDAD" | "INGRESOS"
  >("INGRESOS");

  // Compute current & previous date ranges
  const { startMs, endMs, prevStartMs, prevEndMs, periodLabel } = useMemo(() => {
    const now = new Date();
    const end = now.getTime();
    let durationMs = 30 * 86400000;
    let label = "Últimos 30 días";

    if (period === "HOY") {
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).getTime();
      durationMs = Math.max(end - startOfDay, 12 * 3600000);
      label = "Hoy";
      return {
        startMs: startOfDay,
        endMs: end,
        prevStartMs: startOfDay - 86400000,
        prevEndMs: startOfDay,
        periodLabel: label,
      };
    }

    if (period === "SEMANA") {
      durationMs = 7 * 86400000;
      label = "Últimos 7 días";
    } else if (period === "MES") {
      durationMs = 30 * 86400000;
      label = "Últimos 30 días";
    } else if (period === "ANIO") {
      durationMs = 365 * 86400000;
      label = "Últimos 12 meses";
    } else if (period === "CUSTOM") {
      const s = new Date(`${customStart}T00:00:00`).getTime();
      const e = new Date(`${customEnd}T23:59:59`).getTime();
      const validS = isNaN(s) ? end - 30 * 86400000 : s;
      const validE = isNaN(e) || e < validS ? end : e;
      const d = Math.max(validE - validS, 86400000);
      return {
        startMs: validS,
        endMs: validE,
        prevStartMs: validS - d,
        prevEndMs: validS,
        periodLabel: `${customStart} a ${customEnd}`,
      };
    }

    const start = end - durationMs;
    return {
      startMs: start,
      endMs: end,
      prevStartMs: start - durationMs,
      prevEndMs: start,
      periodLabel: label,
    };
  }, [period, customStart, customEnd]);

  // Filter datasets for current & previous periods
  const analytics = useMemo(() => {
    const currJobs = db.jobs.filter((j) => {
      const t = new Date(j.date).getTime();
      return t >= startMs && t <= endMs;
    });
    const prevJobs = db.jobs.filter((j) => {
      const t = new Date(j.date).getTime();
      return t >= prevStartMs && t < prevEndMs;
    });

    const currTx = db.transactions.filter((tx) => {
      const t = new Date(tx.date).getTime();
      return t >= startMs && t <= endMs;
    });
    const prevTx = db.transactions.filter((tx) => {
      const t = new Date(tx.date).getTime();
      return t >= prevStartMs && t < prevEndMs;
    });

    const currLeads = db.leads.filter((l) => {
      const t = new Date(l.createdAt).getTime();
      return t >= startMs && t <= endMs;
    });
    const prevLeads = db.leads.filter((l) => {
      const t = new Date(l.createdAt).getTime();
      return t >= prevStartMs && t < prevEndMs;
    });

    // KPIs
    const clientsAttended = currJobs.length;
    const prevClientsAttended = prevJobs.length;

    const totalIncome = currTx
      .filter((t) => t.type === "INGRESO")
      .reduce((acc, t) => acc + t.amount, 0);
    const prevTotalIncome = prevTx
      .filter((t) => t.type === "INGRESO")
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = currTx
      .filter((t) => t.type === "EGRESO")
      .reduce((acc, t) => acc + t.amount, 0);
    const prevTotalExpense = prevTx
      .filter((t) => t.type === "EGRESO")
      .reduce((acc, t) => acc + t.amount, 0);

    const netBalance = totalIncome - totalExpense;
    const prevNetBalance = prevTotalIncome - prevTotalExpense;

    const paidJobs = currJobs.filter((j) => j.status === "COBRADO");
    const prevPaidJobs = prevJobs.filter((j) => j.status === "COBRADO");

    const avgTicket =
      paidJobs.length > 0 ? totalIncome / paidJobs.length : 0;
    const prevAvgTicket =
      prevPaidJobs.length > 0 ? prevTotalIncome / prevPaidJobs.length : 0;

    const totalLeadsPool = currLeads.length > 0 ? currLeads : db.leads;
    const closedLeads = totalLeadsPool.filter(
      (l) => l.status === "CERRADO"
    ).length;
    const conversionRate =
      totalLeadsPool.length > 0
        ? Math.round((closedLeads / totalLeadsPool.length) * 100)
        : 0;

    // 1, 2 & 3: Time series buckets (Ingresos vs Egresos, Balance Neto, Clientes atendidos)
    const bucketsCount = period === "HOY" ? 6 : period === "SEMANA" ? 7 : 6;
    const stepMs = Math.max((endMs - startMs) / bucketsCount, 3600000);
    const timeSeries = [];

    for (let i = 0; i < bucketsCount; i++) {
      const bStart = startMs + i * stepMs;
      const bEnd = i === bucketsCount - 1 ? endMs + 1000 : bStart + stepMs;
      const dObj = new Date(bStart);

      const label =
        period === "HOY"
          ? `${String(dObj.getHours()).padStart(2, "0")}:00`
          : period === "ANIO"
          ? dObj.toLocaleDateString("es-AR", { month: "short" })
          : dObj.toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
            });

      const bTx = currTx.filter((tx) => {
        const t = new Date(tx.date).getTime();
        return t >= bStart && t < bEnd;
      });
      const bJobs = currJobs.filter((j) => {
        const t = new Date(j.date).getTime();
        return t >= bStart && t < bEnd;
      });

      const ingresos = bTx
        .filter((t) => t.type === "INGRESO")
        .reduce((s, t) => s + t.amount, 0);
      const egresos = bTx
        .filter((t) => t.type === "EGRESO")
        .reduce((s, t) => s + t.amount, 0);

      timeSeries.push({
        name: label,
        Ingresos: ingresos,
        Egresos: egresos,
        Balance: ingresos - egresos,
        Clientes: bJobs.length,
      });
    }

    // 4. Service Profitability Ranking (By Count & By Revenue)
    const srvMap = new Map<
      string,
      { name: string; cantidad: number; ingresos: number }
    >();
    const jobsForRanking = currJobs.length > 0 ? currJobs : db.jobs;
    for (const j of jobsForRanking) {
      const shortName = j.serviceName
        .replace("Clonación de llaves y lectura de transponder", "Clonación / Transponder")
        .replace("Programación de telemandos", "Telemandos")
        .replace('Cerrajería "Cero llaves"', 'Urgencia "Cero llaves"');
      const existing = srvMap.get(shortName) || {
        name: shortName,
        cantidad: 0,
        ingresos: 0,
      };
      existing.cantidad += 1;
      existing.ingresos += j.priceCharged;
      srvMap.set(shortName, existing);
    }
    const serviceRanking = Array.from(srvMap.values()).sort((a, b) =>
      serviceMetricMode === "INGRESOS"
        ? b.ingresos - a.ingresos
        : b.cantidad - a.cantidad
    );

    // 5. Most Attended Car Brands
    const brandMap = new Map<string, number>();
    for (const j of jobsForRanking) {
      brandMap.set(j.brand, (brandMap.get(j.brand) || 0) + 1);
    }
    const topBrands = Array.from(brandMap.entries())
      .map(([brand, Trabajos]) => ({ brand, Trabajos }))
      .sort((a, b) => b.Trabajos - a.Trabajos)
      .slice(0, 8);

    // 6. Leads Funnel
    const funnelStages = [
      {
        stage: "Nuevo",
        count: db.leads.filter((l) => l.status === "NUEVO").length,
        color: "#1473E6",
      },
      {
        stage: "Contactado",
        count: db.leads.filter((l) => l.status === "CONTACTADO").length,
        color: "#0F5BB8",
      },
      {
        stage: "Presupuestado",
        count: db.leads.filter((l) => l.status === "PRESUPUESTADO").length,
        color: "#1E3A5F",
      },
      {
        stage: "Cerrado",
        count: db.leads.filter((l) => l.status === "CERRADO").length,
        color: "#0B1B2E",
      },
      {
        stage: "Perdido",
        count: db.leads.filter((l) => l.status === "PERDIDO").length,
        color: "#94A3B8",
      },
    ];

    return {
      clientsAttended,
      clientsDelta: calcPercentChange(clientsAttended, prevClientsAttended),
      totalIncome,
      incomeDelta: calcPercentChange(totalIncome, prevTotalIncome),
      totalExpense,
      expenseDelta: calcPercentChange(totalExpense, prevTotalExpense),
      netBalance,
      balanceDelta: calcPercentChange(netBalance, prevNetBalance),
      avgTicket,
      ticketDelta: calcPercentChange(avgTicket, prevAvgTicket),
      newLeadsCount: currLeads.length,
      leadsDelta: calcPercentChange(currLeads.length, prevLeads.length),
      conversionRate,
      timeSeries,
      serviceRanking,
      topBrands,
      funnelStages,
    };
  }, [
    db.jobs,
    db.transactions,
    db.leads,
    startMs,
    endMs,
    prevStartMs,
    prevEndMs,
    period,
    serviceMetricMode,
  ]);

  if (!isLoaded) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-white rounded-xl border border-[#E2E8F0]" />
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-28 bg-white rounded-xl border border-[#E2E8F0]"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-72 bg-white rounded-xl border border-[#E2E8F0]" />
          <div className="h-72 bg-white rounded-xl border border-[#E2E8F0]" />
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Clientes atendidos",
      value: String(analytics.clientsAttended),
      delta: analytics.clientsDelta,
      subtitle: periodLabel,
      icon: Users,
      tone: "neutral" as const,
    },
    {
      title: "Ingresos totales",
      value: formatARS(analytics.totalIncome),
      delta: analytics.incomeDelta,
      subtitle: "Trabajos cobrados",
      icon: TrendingUp,
      tone: "neutral" as const,
    },
    {
      title: "Egresos totales",
      value: formatARS(analytics.totalExpense),
      delta: analytics.expenseDelta,
      subtitle: "Insumos y gastos",
      icon: TrendingDown,
      tone: "neutral" as const,
    },
    {
      title: "Balance neto",
      value: formatARS(analytics.netBalance),
      delta: analytics.balanceDelta,
      subtitle: "Ingresos − Egresos",
      icon: Wallet,
      tone: analytics.netBalance >= 0 ? ("positive" as const) : ("negative" as const),
    },
    {
      title: "Ticket promedio",
      value: formatARS(analytics.avgTicket),
      delta: analytics.ticketDelta,
      subtitle: "Por trabajo cobrado",
      icon: Receipt,
      tone: "neutral" as const,
    },
    {
      title: "Consultas y Conversión",
      value: `${analytics.newLeadsCount} (${analytics.conversionRate}%)`,
      delta: analytics.leadsDelta,
      subtitle: "Leads en período",
      icon: MessageSquareMore,
      tone: "neutral" as const,
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header & Global Period Selector */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 sm:p-5 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1473E6]">
            Panel General · KeyCar Florencio Varela
          </span>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B1B2E]">
            Dashboard Operativo y Financiero
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period Filter Buttons */}
          <div className="inline-flex items-center bg-[#F5F7FA] p-1 rounded-xl border border-[#E2E8F0] overflow-x-auto max-w-full">
            {(
              [
                { id: "HOY", label: "Hoy" },
                { id: "SEMANA", label: "Semana" },
                { id: "MES", label: "Mes" },
                { id: "ANIO", label: "Año" },
                { id: "CUSTOM", label: "Personalizado" },
              ] as { id: PeriodFilter; label: string }[]
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  period === p.id
                    ? "bg-[#1473E6] text-white shadow-sm"
                    : "text-[#4A5568] hover:text-[#0B1B2E]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <Link
            href="/admin/trabajos"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0B1B2E] hover:bg-[#1473E6] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Trabajo</span>
          </Link>
        </div>
      </div>

      {/* Custom Date Range Inputs */}
      {period === "CUSTOM" && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-[#0B1B2E] inline-flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#1473E6]" />
            Rango personalizado:
          </span>
          <div className="flex items-center gap-2">
            <label htmlFor="dash-from" className="text-[#4A5568]">
              Desde:
            </label>
            <input
              id="dash-from"
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] text-[#0B1B2E] font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="dash-to" className="text-[#4A5568]">
              Hasta:
            </label>
            <input
              id="dash-to"
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] text-[#0B1B2E] font-medium"
            />
          </div>
        </div>
      )}

      {/* 6 KPI Cards (2 columns on mobile to avoid vertical scroll, 3 on tablet, 6 on desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const isPositiveDelta = kpi.delta >= 0;

          let valueColor = "text-[#0B1B2E]";
          if (kpi.tone === "positive") valueColor = "text-emerald-700";
          if (kpi.tone === "negative") valueColor = "text-rose-700";

          return (
            <div
              key={kpi.title}
              className="bg-white border border-[#E2E8F0] rounded-xl p-3 sm:p-4 shadow-card flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] sm:text-xs font-semibold text-[#4A5568] truncate">
                  {kpi.title}
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-center text-[#1473E6] flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              <div>
                <p
                  className={`font-heading font-extrabold text-base sm:text-xl tracking-tight truncate ${valueColor}`}
                >
                  {kpi.value}
                </p>
                <div className="flex items-center justify-between gap-1 mt-1.5">
                  <span
                    className={`inline-flex items-center text-[11px] font-bold ${
                      isPositiveDelta ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {isPositiveDelta ? (
                      <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-0.5" />
                    )}
                    {isPositiveDelta ? `+${kpi.delta}%` : `${kpi.delta}%`}
                  </span>
                  <span className="text-[10px] text-[#4A5568] truncate">
                    vs ant.
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS ROW 1: (1) Ingresos vs Egresos AreaChart & (2) Balance Neto BarChart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Chart 1: Ingresos vs Egresos en el tiempo */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
                1. Ingresos vs Egresos en el tiempo
              </h2>
              <p className="text-xs text-[#4A5568]">
                Evolución financiera dentro del período ({periodLabel})
              </p>
            </div>
          </div>
          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics.timeSeries}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#4A5568" }}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                <YAxis
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                  tick={{ fontSize: 11, fill: "#4A5568" }}
                  axisLine={{ stroke: "#E2E8F0" }}
                  width={54}
                />
                <Tooltip
                  formatter={(value: number) => formatARS(Number(value))}
                  contentStyle={{
                    borderRadius: "10px",
                    borderColor: "#E2E8F0",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area
                  type="monotone"
                  dataKey="Ingresos"
                  stroke="#1473E6"
                  strokeWidth={2.5}
                  fill="#1473E6"
                  fillOpacity={0.14}
                />
                <Area
                  type="monotone"
                  dataKey="Egresos"
                  stroke="#64748B"
                  strokeWidth={2}
                  fill="#64748B"
                  fillOpacity={0.12}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Balance Neto por período */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
                2. Balance neto por tramo
              </h2>
              <p className="text-xs text-[#4A5568]">
                Resultado neto (Ingresos − Egresos)
              </p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                analytics.netBalance >= 0
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {analytics.netBalance >= 0 ? "+" : ""}{formatARS(analytics.netBalance)}
            </span>
          </div>
          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.timeSeries}
                margin={{ top: 8, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <ReferenceLine y={0} stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#4A5568" }}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                <YAxis
                  tickFormatter={formatNetAxis}
                  tick={{ fontSize: 11, fill: "#4A5568" }}
                  axisLine={{ stroke: "#E2E8F0" }}
                  width={62}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const isPos = data.Balance >= 0;
                      return (
                        <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] shadow-card text-xs">
                          <p className="font-bold text-[#0B1B2E] mb-1">{data.name}</p>
                          <p className={`font-extrabold text-sm ${isPos ? "text-emerald-700" : "text-rose-600"}`}>
                            Balance: {isPos ? "+" : ""}{formatARS(data.Balance)}
                          </p>
                          <div className="text-[11px] text-[#4A5568] mt-1 space-y-0.5">
                            <p>Ingresos: {formatARS(data.Ingresos)}</p>
                            <p>Egresos: {formatARS(data.Egresos)}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="Balance" maxBarSize={34} radius={[4, 4, 4, 4]}>
                  {analytics.timeSeries.map((entry, idx) => (
                    <Cell
                      key={`cell-bal-${idx}`}
                      fill={entry.Balance >= 0 ? "#10B981" : "#F43F5E"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2: (4) Ranking de Servicios (Con Toggle Cantidad / Ingresos) & (3) Clientes Atendidos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Chart 4: Qué tipo de servicio se renta más (Toggle Por Cantidad / Por Ingresos) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
                4. Rentabilidad y demanda por tipo de servicio
              </h2>
              <p className="text-xs text-[#4A5568]">
                Ranking de servicios más solicitados y mayor facturación
              </p>
            </div>
            <div className="inline-flex bg-[#F5F7FA] p-1 rounded-xl border border-[#E2E8F0] self-start">
              <button
                type="button"
                onClick={() => setServiceMetricMode("INGRESOS")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  serviceMetricMode === "INGRESOS"
                    ? "bg-[#1473E6] text-white"
                    : "text-[#4A5568] hover:text-[#0B1B2E]"
                }`}
              >
                Por ingresos ($)
              </button>
              <button
                type="button"
                onClick={() => setServiceMetricMode("CANTIDAD")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  serviceMetricMode === "CANTIDAD"
                    ? "bg-[#1473E6] text-white"
                    : "text-[#4A5568] hover:text-[#0B1B2E]"
                }`}
              >
                Por cantidad (#)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center">
            <div className="xl:col-span-7 h-56 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={analytics.serviceRanking}
                  margin={{ top: 0, right: 15, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) =>
                      serviceMetricMode === "INGRESOS"
                        ? `$${Math.round(v / 1000)}k`
                        : String(v)
                    }
                    tick={{ fontSize: 11, fill: "#4A5568" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={125}
                    tick={{ fontSize: 11, fill: "#0B1B2E", fontWeight: 600 }}
                  />
                  <Tooltip
                    formatter={(val: number) =>
                      serviceMetricMode === "INGRESOS"
                        ? formatARS(Number(val))
                        : `${val} trabajos`
                    }
                    contentStyle={{
                      borderRadius: "10px",
                      borderColor: "#E2E8F0",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey={
                      serviceMetricMode === "INGRESOS" ? "ingresos" : "cantidad"
                    }
                    fill="#1473E6"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Services Ranking List */}
            <div className="xl:col-span-5 space-y-2">
              {analytics.serviceRanking.slice(0, 5).map((srv, index) => (
                <div
                  key={srv.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-[#0B1B2E] text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-bold text-[#0B1B2E] truncate">
                      {srv.name}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-bold text-[#1473E6]">
                      {formatARS(srv.ingresos)}
                    </p>
                    <p className="text-[10px] text-[#4A5568]">
                      {srv.cantidad} trab.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 3: Clientes atendidos en el período */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card">
          <div className="mb-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
              3. Clientes y vehículos atendidos
            </h2>
            <p className="text-xs text-[#4A5568]">
              Volumen de órdenes de trabajo por tramo
            </p>
          </div>
          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.timeSeries}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#4A5568" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#4A5568" }}
                  width={32}
                />
                <Tooltip
                  formatter={(value: number) => `${value} clientes`}
                  contentStyle={{
                    borderRadius: "10px",
                    borderColor: "#E2E8F0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="Clientes" fill="#1473E6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS ROW 3: (5) Marcas de autos más atendidas & (6) Embudo de Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Chart 5: Marcas de autos más atendidas */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card">
          <div className="mb-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
              5. Marcas de autos más atendidas
            </h2>
            <p className="text-xs text-[#4A5568]">
              Top 8 marcas con mayor ingreso al taller
            </p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.topBrands}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="brand"
                  tick={{ fontSize: 11, fill: "#0B1B2E", fontWeight: 600 }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#4A5568" }}
                  width={32}
                />
                <Tooltip
                  formatter={(value: number) => `${value} vehículos`}
                  contentStyle={{
                    borderRadius: "10px",
                    borderColor: "#E2E8F0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="Trabajos" fill="#0B1B2E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Embudo simple de leads */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
                6. Embudo de consultas (Leads)
              </h2>
              <p className="text-xs text-[#4A5568]">
                Nuevo → Contactado → Presupuestado → Cerrado
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-[#1473E6] hover:underline"
            >
              Ir al Kanban
            </Link>
          </div>

          <div className="space-y-2.5 my-auto">
            {analytics.funnelStages.map((st) => {
              const maxCount = Math.max(
                ...analytics.funnelStages.map((s) => s.count),
                1
              );
              const widthPct = Math.max(
                Math.round((st.count / maxCount) * 100),
                12
              );
              return (
                <div key={st.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0B1B2E]">{st.stage}</span>
                    <span className="font-bold text-[#4A5568]">
                      {st.count} consultas
                    </span>
                  </div>
                  <div className="w-full h-5 bg-[#F5F7FA] rounded-lg overflow-hidden border border-[#E2E8F0]">
                    <div
                      className="h-full rounded-lg transition-all duration-500"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: st.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TABLES ROW: "Últimos trabajos" & "Últimas consultas" */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Table 1: Últimos trabajos */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#1473E6]" />
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
                Últimos trabajos registrados
              </h2>
            </div>
            <Link
              href="/admin/trabajos"
              className="text-xs font-bold text-[#1473E6] hover:underline"
            >
              Ver todos ({db.jobs.length})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#4A5568]">
                  <th className="py-2 pr-2 font-bold">Código / Cliente</th>
                  <th className="py-2 px-2 font-bold">Vehículo / Servicio</th>
                  <th className="py-2 px-2 font-bold">Monto</th>
                  <th className="py-2 pl-2 font-bold text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {db.jobs.slice(0, jobsLimit).map((job) => (
                  <tr key={job.id} className="hover:bg-[#F5F7FA]/60">
                    <td className="py-2.5 pr-2">
                      <p className="font-bold text-[#0B1B2E]">
                        {job.clientName}
                      </p>
                      <p className="text-[11px] text-[#4A5568]">{job.code}</p>
                    </td>
                    <td className="py-2.5 px-2">
                      <p className="font-semibold text-[#0B1B2E]">
                        {job.brand} {job.model} ({job.year})
                      </p>
                      <p className="text-[11px] text-[#4A5568] truncate max-w-[180px]">
                        {job.serviceName}
                      </p>
                    </td>
                    <td className="py-2.5 px-2 font-bold text-[#0B1B2E]">
                      {formatARS(job.priceCharged)}
                    </td>
                    <td className="py-2.5 pl-2 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          job.status === "COBRADO"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : job.status === "FINALIZADO"
                            ? "bg-blue-50 text-[#1473E6] border border-blue-200"
                            : job.status === "EN_PROCESO"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {job.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ver más / Ver menos trabajos */}
          <div className="pt-2.5 mt-2 border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="text-[11px] text-[#4A5568]">
              Mostrando {Math.min(jobsLimit, db.jobs.length)} de {db.jobs.length} trabajos
            </span>
            <button
              type="button"
              onClick={() => setJobsLimit((prev) => (prev === 4 ? 10 : 4))}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#1473E6] hover:underline"
            >
              {jobsLimit === 4 ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Ver más trabajos</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Ver menos</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Table 2: Últimas consultas (Leads) */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <MessageSquareMore className="w-4 h-4 text-[#1473E6]" />
                <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E]">
                  Últimas consultas entrantes
                </h2>
              </div>
              <Link
                href="/admin/leads"
                className="text-xs font-bold text-[#1473E6] hover:underline"
              >
                Ver pipeline ({db.leads.length})
              </Link>
            </div>

            <div className="space-y-2.5">
              {db.leads.slice(0, leadsLimit).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-start justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#0B1B2E] truncate">
                        {lead.name}
                      </p>
                      <span className="text-[10px] text-[#4A5568]">
                        · {lead.zone}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#1473E6] truncate mt-0.5">
                      {lead.serviceName} ({lead.brand} {lead.model})
                    </p>
                    <p className="text-[11px] text-[#4A5568] truncate mt-0.5">
                      {lead.situation}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                      lead.status === "NUEVO"
                        ? "bg-[#1473E6] text-white"
                        : lead.status === "CERRADO"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-white text-[#0B1B2E] border border-[#E2E8F0]"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ver más / Ver menos consultas */}
          <div className="pt-2.5 mt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="text-[11px] text-[#4A5568]">
              Mostrando {Math.min(leadsLimit, db.leads.length)} de {db.leads.length} consultas
            </span>
            <button
              type="button"
              onClick={() => setLeadsLimit((prev) => (prev === 4 ? 8 : 4))}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#1473E6] hover:underline"
            >
              {leadsLimit === 4 ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Ver más consultas</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Ver menos</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

