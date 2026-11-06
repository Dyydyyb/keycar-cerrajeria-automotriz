import { SITE_CONFIG } from "@/config/site";
import {
  ClientRecord,
  JobRecord,
  JobStatus,
  KeyCarDatabaseState,
  LeadRecord,
  LeadStatus,
  PaymentMethod,
  TransactionRecord,
  VehicleRecord,
} from "./types";

const FIRST_NAMES = [
  "Martín", "Lucas", "Matías", "Nicolás", "Sebastián", "Diego", "Gonzalo", "Facundo",
  "Agustín", "Alejandro", "Pablo", "Mariano", "Ezequiel", "Federico", "Leonardo",
  "Hernán", "Ramiro", "Cristian", "Damián", "Maximiliano", "Valeria", "Romina",
  "Carolina", "Florencia", "Natalia", "Luciana", "Gabriela", "Andrea", "Verónica",
  "Micaela", "Sofía", "Camila", "Julieta", "Paula", "Daniela", "Lorena", "Silvina",
  "Gustavo", "Sergio", "Marcelo", "Jorge", "Roberto", "Fernando", "Eduardo",
  "Claudio", "Javier", "Ariel", "Rodrigo", "Leandro", "Ignacio", "Tomás", "Franco",
  "Nahuel", "Lautaro", "Santiago", "Joaquín", "Bautista", "Emiliano", "Esteban", "Bruno"
];

const LAST_NAMES = [
  "González", "Rodríguez", "Gómez", "Fernández", "López", "Díaz", "Martínez", "Pérez",
  "García", "Sánchez", "Romero", "Sosa", "Torres", "Álvarez", "Ruiz", "Ramírez",
  "Flores", "Benítez", "Acosta", "Medina", "Herrera", "Suárez", "Aguirre", "Giménez",
  "Gutiérrez", "Pereyra", "Rojas", "Molina", "Castro", "Ortiz", "Silva", "Núñez",
  "Cabrera", "Ríos", "Morales", "Godoy", "Moreno", "Ferreyra", "Domínguez", "Carrizo",
  "Peralta", "Castillo", "Ledesma", "Quiroga", "Vega", "Vera", "Muñoz", "Ojeda",
  "Ponce", "Villalba", "Cardozo", "Navarro", "Coronel", "Vázquez", "Ramos", "Vargas",
  "Cáceres", "Arias", "Figueroa", "Córdoba"
];

const ZONES = [
  "Florencio Varela Centro",
  "Cruce Varela",
  "Bosques",
  "Zeballos",
  "Villa Vatteone",
  "Santa Rosa (F. Varela)",
  "San Juan Bautista",
  "Gobernador Costa",
  "Ingeniero Allan",
  "Berazategui",
  "Quilmes Oeste",
  "San Francisco Solano",
  "Ranelagh",
  "Ezpeleta",
  "Sourigues",
];

const TAG_POOL = [
  ["Particular"],
  ["Frecuente", "Recomendado"],
  ["Urgencia 24hs"],
  ["Flota Comercial"],
  ["Particular", "Copia Preventiva"],
  ["Agencia Automotor"],
  ["Remis / Cabify"],
  ["Taller Mecánico Aliado"],
];

const PAYMENT_METHODS: PaymentMethod[] = [
  "TRANSFERENCIA",
  "EFECTIVO",
  "MERCADOPAGO",
  "TARJETA",
];

const TECHNICIANS = [
  "Lucas (Taller Principal)",
  "Martín (Electrónica & OBD)",
  "Guardia Móvil 24hs",
];

// Simple deterministic PRNG
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function generatePlate(rng: () => number, year: number): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const l = () => letters[Math.floor(rng() * letters.length)];
  const d = () => Math.floor(rng() * 10);
  if (year >= 2016) {
    const first = year >= 2023 ? "G" : year >= 2020 ? "E" : year >= 2018 ? "C" : "A";
    return `A${first} ${d()}${d()}${d()} ${l()}${l()}`;
  }
  return `${l()}${l()}${l()} ${d()}${d()}${d()}`;
}

export function buildInitialSeedDatabase(): KeyCarDatabaseState {
  const rng = createRng(20261104);
  const now = new Date();

  const brands = SITE_CONFIG.brands;
  const services = SITE_CONFIG.services;

  // 1. Generate 60 Clients + Vehicles
  const clients: ClientRecord[] = [];
  for (let i = 0; i < 60; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    const phoneSuffix = String(310000 + Math.floor(rng() * 680000));
    const phoneDisplay = `11 ${phoneSuffix.slice(0, 2)}45-${phoneSuffix.slice(2, 6)}`;
    const whatsappClean = `54911${phoneSuffix.slice(0, 2)}45${phoneSuffix.slice(2, 6)}`;
    const zone = ZONES[i % ZONES.length];
    const tags = TAG_POOL[i % TAG_POOL.length];

    // Weight brand selection so popular Argentine brands appear higher in rankings
    const brandWeights = [0, 1, 2, 3, 4, 5, 6, 0, 1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const brandObj = brands[brandWeights[Math.floor(rng() * brandWeights.length)]];
    const model =
      brandObj.popularModels[Math.floor(rng() * brandObj.popularModels.length)];
    const year = 2009 + Math.floor(rng() * 16); // 2009 - 2024
    const plate = generatePlate(rng, year);

    const clientId = `cli-${String(i + 1).padStart(3, "0")}`;
    const vehicles: VehicleRecord[] = [
      {
        id: `veh-${String(i + 1).padStart(3, "0")}-a`,
        clientId,
        brand: brandObj.name,
        model,
        year,
        plate,
      },
    ];

    // 20% of clients have a second vehicle
    if (i % 5 === 0) {
      const b2 = brands[(i + 3) % brands.length];
      const m2 = b2.popularModels[0];
      const y2 = 2014 + (i % 10);
      vehicles.push({
        id: `veh-${String(i + 1).padStart(3, "0")}-b`,
        clientId,
        brand: b2.name,
        model: m2,
        year: y2,
        plate: generatePlate(rng, y2),
      });
    }

    const createdDaysAgo = Math.floor(40 + rng() * 170);
    const createdAt = new Date(
      now.getTime() - createdDaysAgo * 24 * 60 * 60 * 1000
    ).toISOString();

    clients.push({
      id: clientId,
      name: fullName,
      phone: phoneDisplay,
      whatsapp: whatsappClean,
      email: `${firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}.${lastName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@gmail.com`,
      zone,
      tags,
      vehicles,
      notes: [
        {
          id: `note-cli-${i + 1}`,
          clientId,
          author: "Lucas (Taller Principal)",
          content:
            i % 3 === 0
              ? `Cliente de ${zone}. Se verificó PIN code por OBD2 y quedó registrado respaldo técnico.`
              : `Atendido en sucursal Av. Gral. San Martín 1574. Muy conforme con la velocidad de entrega.`,
          createdAt,
        },
      ],
      totalSpent: 0,
      jobsCount: 0,
      lastVisit: null,
      createdAt,
    });
  }

  // 2. Generate 210 Jobs across the last 210 days (with extra density in recent 30 days & today)
  const jobs: JobRecord[] = [];
  const transactions: TransactionRecord[] = [];

  // Service distribution weights so "Copias de llaves", "Programación de telemandos" and "Clonación" lead by count, while "Cero llaves" has strong revenue impact
  const serviceOrderWeights = [0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 5, 6];

  for (let j = 0; j < 210; j++) {
    const client = clients[Math.floor(rng() * clients.length)];
    const vehicle =
      client.vehicles[Math.floor(rng() * client.vehicles.length)];
    const srvIdx =
      serviceOrderWeights[Math.floor(rng() * serviceOrderWeights.length)];
    const service = services[srvIdx];

    // Time offset:
    // j < 4: Today (within last 10 hours)
    // j < 18: Last 7 days
    // j < 58: Last 30 days
    // j < 110: Previous month (31 to 60 days ago)
    // rest: 61 to 210 days ago
    let daysAgo = 0;
    if (j < 4) {
      daysAgo = (j * 2.2) / 24; // Today
    } else if (j < 18) {
      daysAgo = 1 + rng() * 6;
    } else if (j < 58) {
      daysAgo = 7 + rng() * 22;
    } else if (j < 110) {
      daysAgo = 30 + rng() * 30;
    } else {
      daysAgo = 60 + rng() * 150;
    }

    const jobDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const jobDateIso = jobDate.toISOString();

    // Price variation (+/- 15% around basePrice)
    const priceMultiplier = 0.9 + rng() * 0.25;
    const priceCharged = Math.round((service.basePrice * priceMultiplier) / 500) * 500;
    const materialCost = Math.round((service.materialCostEstimate * priceMultiplier) / 500) * 500;

    const paymentMethod =
      PAYMENT_METHODS[Math.floor(rng() * PAYMENT_METHODS.length)];
    const technician = TECHNICIANS[j % TECHNICIANS.length];

    let status: JobStatus = "COBRADO";
    if (j === 0) status = "EN_PROCESO";
    else if (j === 1) status = "PENDIENTE";
    else if (j === 4) status = "FINALIZADO";
    else if (j === 7) status = "EN_PROCESO";

    const jobId = `job-${String(210 - j).padStart(4, "0")}`;
    const jobCode = `KC-${String(1000 + (210 - j))}`;

    const jobRecord: JobRecord = {
      id: jobId,
      code: jobCode,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      vehicleId: vehicle.id,
      serviceId: service.id,
      serviceName: service.title,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
      date: jobDateIso,
      priceCharged,
      materialCost,
      paymentMethod,
      status,
      technician,
      notes:
        service.isEmergency
          ? "Asistencia por pérdida total. Apertura sin daño y programación de transponder desde cero."
          : `Servicio de ${service.shortTitle.toLowerCase()} probado con cliente.`,
      createdAt: jobDateIso,
    };

    jobs.push(jobRecord);

    // Update client aggregates
    client.jobsCount += 1;
    if (status === "COBRADO") {
      client.totalSpent += priceCharged;
    }
    if (!client.lastVisit || jobDateIso > client.lastVisit) {
      client.lastVisit = jobDateIso;
    }

    // Automatic Transaction in Finanzas when status === "COBRADO"
    if (status === "COBRADO") {
      transactions.push({
        id: `trx-job-${jobId}`,
        type: "INGRESO",
        category: service.title,
        description: `${jobCode} · ${service.shortTitle} (${vehicle.brand} ${vehicle.model}) - ${client.name}`,
        amount: priceCharged,
        date: jobDateIso,
        paymentMethod,
        jobId,
        jobCode,
      });
    }
  }

  // 3. Generate Realistic Expense Transactions (EGRESOS) across the last 7 months
  const expenseTemplates = [
    {
      category: "Insumos/llaves en blanco",
      description: "Lote de carcasas navaja, espadas vírgenes y transponders ID46/ID48/MQB",
      provider: "Distribuidora Cerrajera Sur",
      baseAmount: 195000,
      freqDays: 10,
      offsetDays: 3,
      method: "TRANSFERENCIA" as PaymentMethod,
    },
    {
      category: "Insumos/llaves en blanco",
      description: "Compra de telemandos originales y pilas CR2032 Panasonic",
      provider: "Importadora KeyTech BA",
      baseAmount: 140000,
      freqDays: 14,
      offsetDays: 8,
      method: "TRANSFERENCIA" as PaymentMethod,
    },
    {
      category: "Herramientas",
      description: "Actualización licencia programador OBD2 / Fresas de carburo para duplicadora",
      provider: "AutoTools Argentina",
      baseAmount: 125000,
      freqDays: 28,
      offsetDays: 16,
      method: "TARJETA" as PaymentMethod,
    },
    {
      category: "Alquiler",
      description: "Alquiler local comercial Av. Gral. San Martín 1574",
      provider: "Inmobiliaria Varela",
      baseAmount: 340000,
      freqDays: 30,
      offsetDays: 5,
      method: "TRANSFERENCIA" as PaymentMethod,
    },
    {
      category: "Servicios",
      description: "Edesur, Internet Fibra Comercial y telefonía móvil guardia 24 hs",
      provider: "Servicios Generales",
      baseAmount: 78000,
      freqDays: 30,
      offsetDays: 20,
      method: "MERCADOPAGO" as PaymentMethod,
    },
    {
      category: "Sueldos",
      description: "Adelanto y liquidación técnica ayudante de taller y guardia",
      provider: "Equipo Técnico KeyCar",
      baseAmount: 260000,
      freqDays: 15,
      offsetDays: 10,
      method: "TRANSFERENCIA" as PaymentMethod,
    },
    {
      category: "Publicidad",
      description: "Campaña anuncios Google Ads / Meta Ads (Florencio Varela y GBA Sur)",
      provider: "Meta / Google Ads",
      baseAmount: 75000,
      freqDays: 20,
      offsetDays: 12,
      method: "TARJETA" as PaymentMethod,
    },
    {
      category: "Impuestos",
      description: "Monotributo, Ingresos Brutos ARBA y Tasa Municipal F. Varela",
      provider: "AFIP / ARBA / Municipio",
      baseAmount: 95000,
      freqDays: 30,
      offsetDays: 25,
      method: "TRANSFERENCIA" as PaymentMethod,
    },
    {
      category: "Combustible",
      description: "Carga combustible móvil de auxilio cerrajería 24 hs",
      provider: "YPF Av. San Martín",
      baseAmount: 38000,
      freqDays: 8,
      offsetDays: 2,
      method: "MERCADOPAGO" as PaymentMethod,
    },
  ];

  let expCounter = 1;
  for (const tpl of expenseTemplates) {
    for (let day = tpl.offsetDays; day <= 200; day += tpl.freqDays) {
      const jitterDays = Math.max(0.5, day + (rng() * 1.5 - 0.75));
      const expDate = new Date(
        now.getTime() - jitterDays * 24 * 60 * 60 * 1000
      );
      const amount =
        Math.round((tpl.baseAmount * (0.92 + rng() * 0.18)) / 1000) * 1000;

      transactions.push({
        id: `trx-exp-${String(expCounter++).padStart(4, "0")}`,
        type: "EGRESO",
        category: tpl.category,
        description: tpl.description,
        amount,
        date: expDate.toISOString(),
        paymentMethod: tpl.method,
        provider: tpl.provider,
      });
    }
  }

  // Sort transactions and jobs newest first
  jobs.sort((a, b) => (a.date < b.date ? 1 : -1));
  transactions.sort((a, b) => (a.date < b.date ? 1 : -1));

  // 4. Generate 28 Realistic Leads across the Kanban pipeline
  const leadStatuses: LeadStatus[] = [
    "NUEVO",
    "NUEVO",
    "NUEVO",
    "CONTACTADO",
    "CONTACTADO",
    "PRESUPUESTADO",
    "PRESUPUESTADO",
    "CERRADO",
    "CERRADO",
    "PERDIDO",
  ];
  const origins: Array<"Web" | "WhatsApp" | "Instagram" | "Local"> = [
    "Web",
    "WhatsApp",
    "Web",
    "Instagram",
    "Local",
  ];

  const leads: LeadRecord[] = [];
  for (let l = 0; l < 28; l++) {
    const firstName = FIRST_NAMES[(l + 15) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(l + 22) % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const zone = ZONES[(l + 4) % ZONES.length];
    const brandObj = brands[(l * 3) % brands.length];
    const model = brandObj.popularModels[l % brandObj.popularModels.length];
    const year = String(2012 + (l % 13));
    const service = services[l % services.length];
    const situation =
      SITE_CONFIG.situations[l % SITE_CONFIG.situations.length];
    const status = leadStatuses[l % leadStatuses.length];
    const origin = origins[l % origins.length];

    const hoursAgo =
      l < 4
        ? l * 2.5 + 0.5
        : l < 12
        ? 24 + l * 10
        : 180 + l * 28;
    const createdAt = new Date(
      now.getTime() - hoursAgo * 60 * 60 * 1000
    ).toISOString();

    const phone = `11 ${34 + (l % 60)}82-${4100 + l * 37}`;
    const schedule =
      l % 3 === 0
        ? "Hoy lo antes posible (Urgencia)"
        : l % 2 === 0
        ? "Por la tarde (14 a 18 hs)"
        : "Por la mañana (9 a 13 hs)";

    const message = `Hola KeyCar! Soy ${name}, de ${zone}. Necesito ${service.title} para mi ${brandObj.name} ${model} ${year}. Situación: ${situation}. ¿Me pasan presupuesto y disponibilidad? Gracias!`;

    leads.push({
      id: `lead-${String(28 - l).padStart(3, "0")}`,
      name,
      phone,
      zone,
      preferredSchedule: schedule,
      serviceName: service.title,
      brand: brandObj.name,
      model,
      year,
      situation,
      message,
      status,
      origin,
      estimatedValue: service.basePrice,
      notes:
        status !== "NUEVO"
          ? [
              {
                id: `note-lead-${l}`,
                leadId: `lead-${String(28 - l).padStart(3, "0")}`,
                author: "Admin KeyCar",
                content:
                  status === "PRESUPUESTADO"
                    ? `Se envió presupuesto de $${service.basePrice.toLocaleString("es-AR")} por WhatsApp. Confirma turno mañana.`
                    : status === "CERRADO"
                    ? "Turno confirmado y trabajo realizado en el taller."
                    : "Se estableció primer contacto por WhatsApp.",
                createdAt,
              },
            ]
          : [],
      createdAt,
    });
  }

  return {
    clients,
    leads,
    jobs,
    transactions,
    waitlist: [
      {
        id: "wait-001",
        name: "Roberto Giménez",
        contact: "11 5412-8890",
        createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
      },
      {
        id: "wait-002",
        name: "Carolina Méndez",
        contact: "carolina.mendez.fv@gmail.com",
        createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
      },
    ],
    settings: {
      businessName: SITE_CONFIG.business.name,
      slogan: SITE_CONFIG.business.slogan,
      address: SITE_CONFIG.business.address.full,
      whatsappNumber: SITE_CONFIG.business.contact.whatsappNumber,
      whatsappDisplay: SITE_CONFIG.business.contact.whatsappDisplay,
      phoneSecondary: "221 363-8369",
      instagram: SITE_CONFIG.business.contact.instagram.handle,
      facebook: SITE_CONFIG.business.contact.facebook.handle,
      schedule: SITE_CONFIG.business.contact.schedule,
      statKeysDone: 2000,
      statHours: 24,
      statBrands: 16,
      adminEmail: "admin@keycar.com.ar",
      adminName: "Administrador KeyCar",
      technicians: TECHNICIANS,
      expenseCategories: SITE_CONFIG.expenseCategories,
    },
  };
}

