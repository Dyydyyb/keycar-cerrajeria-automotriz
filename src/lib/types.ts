export type LeadStatus =
  | "NUEVO"
  | "CONTACTADO"
  | "PRESUPUESTADO"
  | "CERRADO"
  | "PERDIDO";

export type JobStatus =
  | "PENDIENTE"
  | "EN_PROCESO"
  | "FINALIZADO"
  | "COBRADO";

export type PaymentMethod =
  | "EFECTIVO"
  | "TRANSFERENCIA"
  | "TARJETA"
  | "MERCADOPAGO";

export type TransactionType = "INGRESO" | "EGRESO";

export interface VehicleRecord {
  id: string;
  clientId: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
}

export interface NoteRecord {
  id: string;
  content: string;
  author: string;
  clientId?: string;
  leadId?: string;
  createdAt: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  zone: string;
  tags: string[];
  vehicles: VehicleRecord[];
  notes: NoteRecord[];
  totalSpent: number;
  jobsCount: number;
  lastVisit: string | null;
  createdAt: string;
}

export interface LeadRecord {
  id: string;
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
  status: LeadStatus;
  origin: "Web" | "WhatsApp" | "Instagram" | "Local";
  estimatedValue?: number;
  clientId?: string;
  notes: NoteRecord[];
  createdAt: string;
}

export interface JobRecord {
  id: string;
  code: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  vehicleId?: string;
  serviceId: string;
  serviceName: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  date: string; // ISO string
  priceCharged: number;
  materialCost: number;
  paymentMethod: PaymentMethod;
  status: JobStatus;
  technician: string;
  notes?: string;
  createdAt: string;
}

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string; // ISO string
  paymentMethod: PaymentMethod;
  provider?: string;
  receiptUrl?: string;
  jobId?: string;
  jobCode?: string;
}

export interface HomeKeyWaitlistRecord {
  id: string;
  contact: string;
  name?: string;
  createdAt: string;
}

export interface BusinessSettingsRecord {
  businessName: string;
  slogan: string;
  address: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  phoneSecondary: string;
  instagram: string;
  facebook: string;
  schedule: string;
  statKeysDone: number;
  statHours: number;
  statBrands: number;
  adminEmail: string;
  adminName: string;
  technicians: string[];
  expenseCategories: string[];
}

export interface KeyCarDatabaseState {
  clients: ClientRecord[];
  leads: LeadRecord[];
  jobs: JobRecord[];
  transactions: TransactionRecord[];
  waitlist: HomeKeyWaitlistRecord[];
  settings: BusinessSettingsRecord;
}

