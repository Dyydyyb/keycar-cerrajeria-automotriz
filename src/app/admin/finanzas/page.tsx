"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Percent,
  Trash2,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useKeyCar } from "@/context/KeyCarContext";
import { PaymentMethod } from "@/lib/types";
import { SITE_CONFIG } from "@/config/site";

function formatARS(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-AR")}`;
}

const PIE_COLORS = [
  "#1473E6",
  "#0B1B2E",
  "#0F5BB8",
  "#3B82F6",
  "#475569",
  "#64748B",
  "#94A3B8",
  "#CBD5E1",
];

export default function AdminFinanzasPage() {
  const { db, addTransaction, deleteTransaction } = useKeyCar();

  const [typeFilter, setTypeFilter] = useState<"TODOS" | "INGRESO" | "EGRESO">(
    "TODOS"
  );
  const [categoryFilter, setCategoryFilter] = useState("TODAS");
  const [daysFilter, setDaysFilter] = useState<number>(30);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const [modalMode, setModalMode] = useState<"EGRESO" | "INGRESO" | null>(null);
  const [txForm, setTxForm] = useState({
    category: SITE_CONFIG.expenseCategories[0],
    description: "",
    amount: 45000,
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: "TRANSFERENCIA" as PaymentMethod,
    provider: "",
    receiptUrl: "",
  });

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    const cutoffMs =
      daysFilter > 0 ? Date.now() - daysFilter * 86400000 : 0;

    return db.transactions.filter((t) => {
      const tMs = new Date(t.date).getTime();
      if (cutoffMs > 0 && tMs < cutoffMs) return false;
      if (typeFilter !== "TODOS" && t.type !== typeFilter) return false;
      if (categoryFilter !== "TODAS" && t.category !== categoryFilter)
        return false;
      return true;
    });
  }, [db.transactions, typeFilter, categoryFilter, daysFilter]);

  const summary = useMemo(() => {
    const ingresos = filteredTransactions
      .filter((t) => t.type === "INGRESO")
      .reduce((acc, t) => acc + t.amount, 0);
    const egresos = filteredTransactions
      .filter((t) => t.type === "EGRESO")
      .reduce((acc, t) => acc + t.amount, 0);
    const balance = ingresos - egresos;
    const marginPct =
      ingresos > 0 ? Math.round(((ingresos - egresos) / ingresos) * 100) : 0;

    // Caja por método de pago
    const methods: PaymentMethod[] = [
      "EFECTIVO",
      "TRANSFERENCIA",
      "MERCADOPAGO",
      "TARJETA",
    ];
    const byMethod = methods.map((m) => {
      const mIn = filteredTransactions
        .filter((t) => t.type === "INGRESO" && t.paymentMethod === m)
        .reduce((a, t) => a + t.amount, 0);
      const mOut = filteredTransactions
        .filter((t) => t.type === "EGRESO" && t.paymentMethod === m)
        .reduce((a, t) => a + t.amount, 0);
      return {
        method: m,
        ingresos: mIn,
        egresos: mOut,
        neto: mIn - mOut,
      };
    });

    // Monthly Evolution (last 6 months)
    const now = new Date();
    const monthlyEvolution = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const mLabel = d.toLocaleDateString("es-AR", { month: "short" });

      const mTx = db.transactions.filter((t) => {
        const ms = new Date(t.date).getTime();
        return ms >= d.getTime() && ms < nextD.getTime();
      });

      monthlyEvolution.push({
        mes: mLabel,
        Ingresos: mTx
          .filter((t) => t.type === "INGRESO")
          .reduce((a, t) => a + t.amount, 0),
        Egresos: mTx
          .filter((t) => t.type === "EGRESO")
          .reduce((a, t) => a + t.amount, 0),
      });
    }

    // Expense distribution by category
    const expCatMap = new Map<string, number>();
    for (const t of filteredTransactions.filter((tx) => tx.type === "EGRESO")) {
      expCatMap.set(t.category, (expCatMap.get(t.category) || 0) + t.amount);
    }
    const expenseDistribution = Array.from(expCatMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      ingresos,
      egresos,
      balance,
      marginPct,
      byMethod,
      monthlyEvolution,
      expenseDistribution,
    };
  }, [filteredTransactions, db.transactions]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize)
  );
  const paginatedTx = filteredTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalMode || !txForm.description.trim()) return;
    addTransaction({
      type: modalMode,
      category: txForm.category,
      description: txForm.description,
      amount: Number(txForm.amount) || 0,
      date: txForm.date,
      paymentMethod: txForm.paymentMethod,
      provider: txForm.provider,
      receiptUrl: txForm.receiptUrl,
    });
    setModalMode(null);
    setTxForm({
      ...txForm,
      description: "",
      provider: "",
      receiptUrl: "",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1473E6]">
            Flujo de Caja · Ingresos Automáticos y Control de Gastos
          </span>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B1B2E]">
            Finanzas, Ingresos y Egresos
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTxForm({
                ...txForm,
                category: SITE_CONFIG.expenseCategories[0],
              });
              setModalMode("EGRESO");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0B1B2E] hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Egreso</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTxForm({
                ...txForm,
                category: "Ingreso Manual / Mostrador",
              });
              setModalMode("INGRESO");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#1473E6] hover:bg-[#0F5BB8] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ingreso Manual</span>
          </button>
        </div>
      </div>

      {/* Top 4 Financial Summary Cards (2x2 on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 sm:p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-[#4A5568] mb-1">
            <span>Total Ingresos</span>
            <TrendingUp className="w-4 h-4 text-[#1473E6]" />
          </div>
          <p className="font-heading font-extrabold text-lg sm:text-2xl text-[#0B1B2E]">
            {formatARS(summary.ingresos)}
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 sm:p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-[#4A5568] mb-1">
            <span>Total Egresos</span>
            <TrendingDown className="w-4 h-4 text-[#4A5568]" />
          </div>
          <p className="font-heading font-extrabold text-lg sm:text-2xl text-[#0B1B2E]">
            {formatARS(summary.egresos)}
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 sm:p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-[#4A5568] mb-1">
            <span>Balance Neto</span>
            <Wallet className="w-4 h-4 text-[#1473E6]" />
          </div>
          <p
            className={`font-heading font-extrabold text-lg sm:text-2xl ${
              summary.balance >= 0 ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {formatARS(summary.balance)}
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 sm:p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-[#4A5568] mb-1">
            <span>Margen de Ganancia</span>
            <Percent className="w-4 h-4 text-[#1473E6]" />
          </div>
          <p className="font-heading font-extrabold text-lg sm:text-2xl text-[#1473E6]">
            {summary.marginPct}%
          </p>
        </div>
      </div>

      {/* Caja por Método de Pago (2x2 on mobile, 4 cols on desktop) */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-card">
        <h2 className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-[#0B1B2E] mb-3">
          Arqueo de Caja por Método de Pago
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {summary.byMethod.map((m) => (
            <div
              key={m.method}
              className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-xs"
            >
              <p className="font-heading font-bold text-[#0B1B2E]">
                {m.method}
              </p>
              <p className="font-extrabold text-sm sm:text-base text-[#1473E6] mt-0.5">
                Neto: {formatARS(m.neto)}
              </p>
              <p className="text-[11px] text-[#4A5568] mt-1">
                +{formatARS(m.ingresos)} / -{formatARS(m.egresos)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts: Monthly Evolution & Expense Distribution by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card">
          <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E] mb-1">
            Evolución Mensual (Últimos 6 meses)
          </h2>
          <p className="text-xs text-[#4A5568] mb-4">
            Comparativa mensual de ingresos cobrados vs gastos operativos
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.monthlyEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 11, fill: "#4A5568" }}
                />
                <YAxis
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                  tick={{ fontSize: 11, fill: "#4A5568" }}
                  width={54}
                />
                <Tooltip
                  formatter={(v: number) => formatARS(Number(v))}
                  contentStyle={{
                    borderRadius: "10px",
                    borderColor: "#E2E8F0",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="Ingresos" fill="#1473E6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Egresos" fill="#0B1B2E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card">
          <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B1B2E] mb-1">
            Distribución de Egresos por Categoría
          </h2>
          <p className="text-xs text-[#4A5568] mb-3">
            Insumos, herramientas, alquiler, sueldos y servicios
          </p>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {summary.expenseDistribution.map((cat, idx) => {
              const pct =
                summary.egresos > 0
                  ? Math.round((cat.value / summary.egresos) * 100)
                  : 0;
              return (
                <div key={cat.name} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0B1B2E] truncate">
                      {cat.name}
                    </span>
                    <span className="font-semibold text-[#4A5568]">
                      {formatARS(cat.value)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F5F7FA] rounded-full overflow-hidden border border-[#E2E8F0]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(pct, 4)}%`,
                        backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters & Transactions Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(
                  e.target.value as "TODOS" | "INGRESO" | "EGRESO"
                );
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs font-bold text-[#0B1B2E]"
            >
              <option value="TODOS">Todos los movimientos</option>
              <option value="INGRESO">Solo Ingresos (+)</option>
              <option value="EGRESO">Solo Egresos (-)</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs font-medium text-[#0B1B2E]"
            >
              <option value="TODAS">Todas las categorías</option>
              {SITE_CONFIG.expenseCategories.map((c) => (
                <option key={c} value={c}>
                  Egreso: {c}
                </option>
              ))}
              {SITE_CONFIG.services.map((s) => (
                <option key={s.id} value={s.title}>
                  Ingreso: {s.shortTitle}
                </option>
              ))}
            </select>

            <select
              value={daysFilter}
              onChange={(e) => {
                setDaysFilter(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs font-medium text-[#0B1B2E]"
            >
              <option value={7}>Últimos 7 días</option>
              <option value={30}>Últimos 30 días</option>
              <option value={90}>Últimos 90 días</option>
              <option value={0}>Todo el historial</option>
            </select>
          </div>
          <span className="text-xs text-[#4A5568]">
            {filteredTransactions.length} movimientos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#4A5568]">
                <th className="py-2.5 pr-3 font-bold">Fecha / Tipo</th>
                <th className="py-2.5 px-3 font-bold">Categoría / Detalle</th>
                <th className="py-2.5 px-3 font-bold">Método / Proveedor</th>
                <th className="py-2.5 pl-3 font-bold text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {paginatedTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F5F7FA]/70">
                  <td className="py-2.5 pr-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.type === "INGRESO"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-[#0B1B2E] border border-slate-200"
                      }`}
                    >
                      {tx.type}
                    </span>
                    <p className="text-[11px] text-[#4A5568] mt-0.5">
                      {new Date(tx.date).toLocaleDateString("es-AR")}
                    </p>
                  </td>
                  <td className="py-2.5 px-3">
                    <p className="font-bold text-[#0B1B2E]">{tx.category}</p>
                    <p className="text-[11px] text-[#4A5568] max-w-md truncate">
                      {tx.description}
                    </p>
                  </td>
                  <td className="py-2.5 px-3">
                    <p className="font-semibold text-[#0B1B2E]">
                      {tx.paymentMethod}
                    </p>
                    {tx.provider && (
                      <p className="text-[11px] text-[#4A5568]">
                        Prov: {tx.provider}
                      </p>
                    )}
                  </td>
                  <td className="py-2.5 pl-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <span
                        className={`font-heading font-extrabold text-sm ${
                          tx.type === "INGRESO"
                            ? "text-emerald-700"
                            : "text-[#0B1B2E]"
                        }`}
                      >
                        {tx.type === "INGRESO" ? "+" : "-"}
                        {formatARS(tx.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1 text-[#4A5568] hover:text-rose-700"
                        title="Eliminar movimiento"
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

        {/* Pagination & "Ver más" */}
        <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#4A5568]">
              Mostrando <strong>{paginatedTx.length}</strong> de <strong>{filteredTransactions.length}</strong> movimientos
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <button
              type="button"
              onClick={() => {
                setPageSize((prev) => (prev <= 5 ? 15 : 5));
                setPage(1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-[#F5F7FA] hover:bg-[#1473E6] text-[#0B1B2E] hover:text-white border border-[#E2E8F0] transition-colors"
            >
              {pageSize <= 5 ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Ver más filas (15)</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
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
              className="p-1.5 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ADD EXPENSE / MANUAL INCOME MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-[#0B1B2E]/60 backdrop-blur-xs flex items-center justify-center p-3">
          <form
            onSubmit={handleCreateTx}
            className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-cardHover space-y-3 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h2 className="font-heading font-extrabold text-base text-[#0B1B2E]">
                {modalMode === "EGRESO"
                  ? "Registrar Nuevo Egreso"
                  : "Registrar Ingreso Manual"}
              </h2>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="p-1 text-[#4A5568]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Categoría *
              </label>
              {modalMode === "EGRESO" ? (
                <select
                  value={txForm.category}
                  onChange={(e) =>
                    setTxForm({ ...txForm, category: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                >
                  {SITE_CONFIG.expenseCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={txForm.category}
                  onChange={(e) =>
                    setTxForm({ ...txForm, category: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              )}
            </div>

            <div>
              <label className="block font-bold text-[#0B1B2E] mb-1">
                Descripción / Concepto *
              </label>
              <input
                type="text"
                required
                value={txForm.description}
                onChange={(e) =>
                  setTxForm({ ...txForm, description: e.target.value })
                }
                placeholder={
                  modalMode === "EGRESO"
                    ? "Ej: Compra lote 20 carcasas Peugeot/VW y chips ID48"
                    : "Ej: Venta de carcasa y pila en mostrador"
                }
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Monto ($) *
                </label>
                <input
                  type="number"
                  required
                  value={txForm.amount}
                  onChange={(e) =>
                    setTxForm({ ...txForm, amount: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0B1B2E] mb-1">
                  Método de Pago
                </label>
                <select
                  value={txForm.paymentMethod}
                  onChange={(e) =>
                    setTxForm({
                      ...txForm,
                      paymentMethod: e.target.value as PaymentMethod,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                >
                  <option value="TRANSFERENCIA">Transferencia</option>
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="MERCADOPAGO">MercadoPago</option>
                  <option value="TARJETA">Tarjeta</option>
                </select>
              </div>
            </div>

            {modalMode === "EGRESO" && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-[#0B1B2E] mb-1">
                    Proveedor (opcional)
                  </label>
                  <input
                    type="text"
                    value={txForm.provider}
                    onChange={(e) =>
                      setTxForm({ ...txForm, provider: e.target.value })
                    }
                    placeholder="Ej: Distribuidora Sur"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0B1B2E] mb-1">
                    N° Comprobante / Factura
                  </label>
                  <input
                    type="text"
                    value={txForm.receiptUrl}
                    onChange={(e) =>
                      setTxForm({ ...txForm, receiptUrl: e.target.value })
                    }
                    placeholder="Ej: FC-A 0004-1290"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1473E6] text-white font-bold"
              >
                Guardar Movimiento
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

