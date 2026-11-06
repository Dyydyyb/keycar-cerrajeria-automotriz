"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { buildInitialSeedDatabase } from "@/lib/seed-data";
import {
  BusinessSettingsRecord,
  ClientRecord,
  HomeKeyWaitlistRecord,
  JobRecord,
  JobStatus,
  KeyCarDatabaseState,
  LeadRecord,
  LeadStatus,
  PaymentMethod,
  TransactionRecord,
} from "@/lib/types";
import { SITE_CONFIG } from "@/config/site";

const STORAGE_KEY = "keycar_crm_db_v5";

interface CreateLeadInput {
  name: string;
  phone?: string;
  zone: string;
  preferredSchedule?: string;
  serviceName: string;
  brand: string;
  model: string;
  year: string;
  situation: string;
  message: string;
  origin?: "Web" | "WhatsApp" | "Instagram" | "Local";
}

interface CreateClientInput {
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  zone: string;
  tags?: string[];
  vehicle?: {
    brand: string;
    model: string;
    year: number;
    plate: string;
  };
  initialNote?: string;
}

interface CreateJobInput {
  clientId: string;
  serviceId: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  date?: string;
  priceCharged: number;
  materialCost: number;
  paymentMethod: PaymentMethod;
  status: JobStatus;
  technician: string;
  notes?: string;
}

interface CreateTransactionInput {
  type: "INGRESO" | "EGRESO";
  category: string;
  description: string;
  amount: number;
  date?: string;
  paymentMethod: PaymentMethod;
  provider?: string;
  receiptUrl?: string;
}

interface KeyCarContextValue {
  db: KeyCarDatabaseState;
  isLoaded: boolean;
  // Lead actions
  addLead: (input: CreateLeadInput) => LeadRecord;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  addLeadNote: (leadId: string, content: string) => void;
  deleteLead: (leadId: string) => void;
  convertLeadToClient: (leadId: string) => ClientRecord | null;
  // Client actions
  addClient: (input: CreateClientInput) => ClientRecord;
  updateClient: (clientId: string, partial: Partial<ClientRecord>) => void;
  deleteClient: (clientId: string) => void;
  addClientNote: (clientId: string, content: string) => void;
  addClientVehicle: (
    clientId: string,
    vehicle: { brand: string; model: string; year: number; plate: string }
  ) => void;
  // Job actions
  addJob: (input: CreateJobInput) => JobRecord;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  deleteJob: (jobId: string) => void;
  // Finance actions
  addTransaction: (input: CreateTransactionInput) => TransactionRecord;
  deleteTransaction: (txId: string) => void;
  // Waitlist ("Llaves para el hogar")
  addWaitlistContact: (contact: string, name?: string) => void;
  // Settings
  updateSettings: (partial: Partial<BusinessSettingsRecord>) => void;
  resetDemoData: () => void;
}

const KeyCarContext = createContext<KeyCarContextValue | null>(null);

export function KeyCarProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<KeyCarDatabaseState>(() =>
    buildInitialSeedDatabase()
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as KeyCarDatabaseState;
        if (parsed && Array.isArray(parsed.clients) && Array.isArray(parsed.jobs)) {
          setDb(parsed);
        }
      } else {
        const initial = buildInitialSeedDatabase();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        setDb(initial);
      }
    } catch (e) {
      console.error("Error loading KeyCar DB:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const persist = (updater: (prev: KeyCarDatabaseState) => KeyCarDatabaseState) => {
    setDb((prev) => {
      const next = updater(prev);
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      } catch (err) {
        console.error("Error saving KeyCar DB:", err);
      }
      return next;
    });
  };

  const addLead = (input: CreateLeadInput): LeadRecord => {
    const srvMatch = SITE_CONFIG.services.find(
      (s) =>
        s.title.toLowerCase() === input.serviceName.toLowerCase() ||
        s.shortTitle.toLowerCase() === input.serviceName.toLowerCase()
    );

    const newLead: LeadRecord = {
      id: `lead-${Date.now()}`,
      name: input.name.trim(),
      phone: input.phone?.trim() || "Sin especificar",
      zone: input.zone.trim() || "Florencio Varela",
      preferredSchedule: input.preferredSchedule?.trim() || "A coordinar",
      serviceName: input.serviceName,
      brand: input.brand,
      model: input.model.trim() || "Consultar",
      year: input.year.trim() || "S/D",
      situation: input.situation,
      message: input.message,
      status: "NUEVO",
      origin: input.origin || "Web",
      estimatedValue: srvMatch ? srvMatch.basePrice : 68000,
      notes: [],
      createdAt: new Date().toISOString(),
    };

    persist((prev) => ({
      ...prev,
      leads: [newLead, ...prev.leads],
    }));

    return newLead;
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus) => {
    persist((prev) => ({
      ...prev,
      leads: prev.leads.map((l) =>
        l.id === leadId ? { ...l, status } : l
      ),
    }));
  };

  const addLeadNote = (leadId: string, content: string) => {
    if (!content.trim()) return;
    persist((prev) => ({
      ...prev,
      leads: prev.leads.map((l) =>
        l.id === leadId
          ? {
              ...l,
              notes: [
                ...l.notes,
                {
                  id: `note-${Date.now()}`,
                  leadId,
                  author: "Admin KeyCar",
                  content: content.trim(),
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : l
      ),
    }));
  };

  const deleteLead = (leadId: string) => {
    persist((prev) => ({
      ...prev,
      leads: prev.leads.filter((l) => l.id !== leadId),
    }));
  };

  const addClient = (input: CreateClientInput): ClientRecord => {
    const clientId = `cli-${Date.now()}`;
    const cleanPhone = (input.whatsapp || input.phone).replace(/\D/g, "");
    const whatsapp = cleanPhone.startsWith("54")
      ? cleanPhone
      : `549${cleanPhone}`;
    const nowIso = new Date().toISOString();

    const newClient: ClientRecord = {
      id: clientId,
      name: input.name.trim(),
      phone: input.phone.trim(),
      whatsapp,
      email: input.email?.trim() || undefined,
      zone: input.zone.trim() || "Florencio Varela",
      tags: input.tags && input.tags.length > 0 ? input.tags : ["Particular"],
      vehicles: input.vehicle
        ? [
            {
              id: `veh-${Date.now()}`,
              clientId,
              brand: input.vehicle.brand,
              model: input.vehicle.model,
              year: Number(input.vehicle.year) || 2020,
              plate: input.vehicle.plate || "S/P",
            },
          ]
        : [],
      notes: input.initialNote
        ? [
            {
              id: `note-${Date.now()}`,
              clientId,
              author: "Admin KeyCar",
              content: input.initialNote,
              createdAt: nowIso,
            },
          ]
        : [],
      totalSpent: 0,
      jobsCount: 0,
      lastVisit: nowIso,
      createdAt: nowIso,
    };

    persist((prev) => ({
      ...prev,
      clients: [newClient, ...prev.clients],
    }));

    return newClient;
  };

  const convertLeadToClient = (leadId: string): ClientRecord | null => {
    const lead = db.leads.find((l) => l.id === leadId);
    if (!lead) return null;

    const clientId = `cli-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const rawDigits = (lead.phone || "1100000000").replace(/\D/g, "");
    const whatsapp = rawDigits.startsWith("54") ? rawDigits : `549${rawDigits}`;

    const newClient: ClientRecord = {
      id: clientId,
      name: lead.name,
      phone: lead.phone || "Sin teléfono",
      whatsapp,
      zone: lead.zone || "Florencio Varela",
      tags: ["Convertido Web", lead.situation.includes("urgencia") ? "Urgencia 24hs" : "Particular"],
      vehicles: [
        {
          id: `veh-${Date.now()}`,
          clientId,
          brand: lead.brand,
          model: lead.model,
          year: Number(lead.year) || 2020,
          plate: "A confirmar",
        },
      ],
      notes: [
        {
          id: `note-${Date.now()}`,
          clientId,
          author: "Sistema CRM",
          content: `Convertido desde consulta web (${lead.serviceName} - Situación: ${lead.situation}). Mensaje original: "${lead.message}"`,
          createdAt: nowIso,
        },
      ],
      totalSpent: 0,
      jobsCount: 0,
      lastVisit: nowIso,
      createdAt: nowIso,
    };

    persist((prev) => ({
      ...prev,
      clients: [newClient, ...prev.clients],
      leads: prev.leads.map((l) =>
        l.id === leadId
          ? { ...l, status: "CERRADO", clientId: newClient.id }
          : l
      ),
    }));

    return newClient;
  };

  const updateClient = (clientId: string, partial: Partial<ClientRecord>) => {
    persist((prev) => ({
      ...prev,
      clients: prev.clients.map((c) =>
        c.id === clientId ? { ...c, ...partial } : c
      ),
    }));
  };

  const deleteClient = (clientId: string) => {
    persist((prev) => ({
      ...prev,
      clients: prev.clients.filter((c) => c.id !== clientId),
    }));
  };

  const addClientNote = (clientId: string, content: string) => {
    if (!content.trim()) return;
    persist((prev) => ({
      ...prev,
      clients: prev.clients.map((c) =>
        c.id === clientId
          ? {
              ...c,
              notes: [
                {
                  id: `note-${Date.now()}`,
                  clientId,
                  author: "Admin KeyCar",
                  content: content.trim(),
                  createdAt: new Date().toISOString(),
                },
                ...c.notes,
              ],
            }
          : c
      ),
    }));
  };

  const addClientVehicle = (
    clientId: string,
    vehicle: { brand: string; model: string; year: number; plate: string }
  ) => {
    persist((prev) => ({
      ...prev,
      clients: prev.clients.map((c) =>
        c.id === clientId
          ? {
              ...c,
              vehicles: [
                ...c.vehicles,
                {
                  id: `veh-${Date.now()}`,
                  clientId,
                  ...vehicle,
                },
              ],
            }
          : c
      ),
    }));
  };

  const addJob = (input: CreateJobInput): JobRecord => {
    const client = db.clients.find((c) => c.id === input.clientId);
    const service =
      SITE_CONFIG.services.find((s) => s.id === input.serviceId) ||
      SITE_CONFIG.services[0];

    const jobDate = input.date
      ? new Date(input.date).toISOString()
      : new Date().toISOString();
    const jobId = `job-${Date.now()}`;
    const jobCode = `KC-${1211 + db.jobs.length}`;

    const newJob: JobRecord = {
      id: jobId,
      code: jobCode,
      clientId: input.clientId,
      clientName: client ? client.name : "Cliente Taller",
      clientPhone: client ? client.phone : "11 7894-4996",
      serviceId: service.id,
      serviceName: service.title,
      brand: input.brand,
      model: input.model,
      year: Number(input.year) || 2020,
      plate: input.plate || "S/P",
      date: jobDate,
      priceCharged: Number(input.priceCharged) || 0,
      materialCost: Number(input.materialCost) || 0,
      paymentMethod: input.paymentMethod,
      status: input.status,
      technician: input.technician,
      notes: input.notes,
      createdAt: new Date().toISOString(),
    };

    persist((prev) => {
      const nextTransactions = [...prev.transactions];
      if (newJob.status === "COBRADO") {
        nextTransactions.unshift({
          id: `trx-job-${newJob.id}`,
          type: "INGRESO",
          category: newJob.serviceName,
          description: `${newJob.code} · ${newJob.serviceName} (${newJob.brand} ${newJob.model}) - ${newJob.clientName}`,
          amount: newJob.priceCharged,
          date: newJob.date,
          paymentMethod: newJob.paymentMethod,
          jobId: newJob.id,
          jobCode: newJob.code,
        });
      }

      const nextClients = prev.clients.map((c) => {
        if (c.id !== newJob.clientId) return c;
        return {
          ...c,
          jobsCount: c.jobsCount + 1,
          totalSpent:
            newJob.status === "COBRADO"
              ? c.totalSpent + newJob.priceCharged
              : c.totalSpent,
          lastVisit: newJob.date,
        };
      });

      return {
        ...prev,
        jobs: [newJob, ...prev.jobs],
        transactions: nextTransactions,
        clients: nextClients,
      };
    });

    return newJob;
  };

  const updateJobStatus = (jobId: string, newStatus: JobStatus) => {
    persist((prev) => {
      const targetJob = prev.jobs.find((j) => j.id === jobId);
      if (!targetJob || targetJob.status === newStatus) return prev;

      const wasCobrado = targetJob.status === "COBRADO";
      const isNowCobrado = newStatus === "COBRADO";

      const nextJobs = prev.jobs.map((j) =>
        j.id === jobId ? { ...j, status: newStatus } : j
      );

      let nextTransactions = [...prev.transactions];
      // Al marcar como COBRADO, generar automáticamente el ingreso en Finanzas
      if (!wasCobrado && isNowCobrado) {
        const exists = nextTransactions.some((t) => t.jobId === jobId);
        if (!exists) {
          nextTransactions.unshift({
            id: `trx-job-${targetJob.id}`,
            type: "INGRESO",
            category: targetJob.serviceName,
            description: `${targetJob.code} · ${targetJob.serviceName} (${targetJob.brand} ${targetJob.model}) - ${targetJob.clientName}`,
            amount: targetJob.priceCharged,
            date: new Date().toISOString(),
            paymentMethod: targetJob.paymentMethod,
            jobId: targetJob.id,
            jobCode: targetJob.code,
          });
        }
      } else if (wasCobrado && !isNowCobrado) {
        nextTransactions = nextTransactions.filter((t) => t.jobId !== jobId);
      }

      const nextClients = prev.clients.map((c) => {
        if (c.id !== targetJob.clientId) return c;
        let delta = 0;
        if (!wasCobrado && isNowCobrado) delta = targetJob.priceCharged;
        if (wasCobrado && !isNowCobrado) delta = -targetJob.priceCharged;
        return {
          ...c,
          totalSpent: Math.max(0, c.totalSpent + delta),
        };
      });

      return {
        ...prev,
        jobs: nextJobs,
        transactions: nextTransactions,
        clients: nextClients,
      };
    });
  };

  const deleteJob = (jobId: string) => {
    persist((prev) => ({
      ...prev,
      jobs: prev.jobs.filter((j) => j.id !== jobId),
      transactions: prev.transactions.filter((t) => t.jobId !== jobId),
    }));
  };

  const addTransaction = (input: CreateTransactionInput): TransactionRecord => {
    const newTx: TransactionRecord = {
      id: `trx-${Date.now()}`,
      type: input.type,
      category: input.category,
      description: input.description.trim(),
      amount: Number(input.amount) || 0,
      date: input.date
        ? new Date(input.date).toISOString()
        : new Date().toISOString(),
      paymentMethod: input.paymentMethod,
      provider: input.provider?.trim() || undefined,
      receiptUrl: input.receiptUrl?.trim() || undefined,
    };

    persist((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }));

    return newTx;
  };

  const deleteTransaction = (txId: string) => {
    persist((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== txId),
    }));
  };

  const addWaitlistContact = (contact: string, name?: string) => {
    if (!contact.trim()) return;
    const item: HomeKeyWaitlistRecord = {
      id: `wait-${Date.now()}`,
      contact: contact.trim(),
      name: name?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    persist((prev) => ({
      ...prev,
      waitlist: [item, ...prev.waitlist],
    }));
  };

  const updateSettings = (partial: Partial<BusinessSettingsRecord>) => {
    persist((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...partial,
      },
    }));
  };

  const resetDemoData = () => {
    const fresh = buildInitialSeedDatabase();
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    }
    setDb(fresh);
  };

  return (
    <KeyCarContext.Provider
      value={{
        db,
        isLoaded,
        addLead,
        updateLeadStatus,
        addLeadNote,
        deleteLead,
        convertLeadToClient,
        addClient,
        updateClient,
        deleteClient,
        addClientNote,
        addClientVehicle,
        addJob,
        updateJobStatus,
        deleteJob,
        addTransaction,
        deleteTransaction,
        addWaitlistContact,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}
    </KeyCarContext.Provider>
  );
}

export function useKeyCar() {
  const ctx = useContext(KeyCarContext);
  if (!ctx) {
    throw new Error("useKeyCar must be used within a KeyCarProvider");
  }
  return ctx;
}

