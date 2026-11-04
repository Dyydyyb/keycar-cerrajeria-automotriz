export interface ServiceCatalogItem {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  slogan: string;
  description: string;
  checklist: string[];
  iconName:
    | "KeyRound"
    | "Radio"
    | "Cpu"
    | "Wrench"
    | "Lock"
    | "PanelTop"
    | "ShieldAlert";
  basePrice: number;
  materialCostEstimate: number;
  isEmergency?: boolean;
}

export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logoPath: string;
  popularModels: string[];
}

export interface CounterStatItem {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
  editableNote: string;
}

export const SITE_CONFIG = {
  business: {
    name: "KeyCar",
    namePart1: "Key",
    namePart2: "Car",
    category: "Especialistas en llaves automotrices",
    slogan: "Tu llave, nuestro trabajo",
    values: [
      {
        id: "calidad",
        title: "Calidad",
        description:
          "Trabajamos con insumos seleccionados, componentes electrónicos confiables y maquinaria de precisión para garantizar durabilidad en cada llave y control.",
      },
      {
        id: "rapidez",
        title: "Rapidez",
        description:
          "Diagnóstico ágil en el acto y resolución eficiente tanto en taller como ante urgencias por pérdida total de llaves.",
      },
      {
        id: "confianza",
        title: "Confianza",
        description:
          "Atención transparente, presupuesto claro antes de intervenir el vehículo y respaldo técnico especializado en Florencio Varela.",
      },
    ],
    address: {
      street: "Av. Gral. San Martín 1574",
      city: "Florencio Varela",
      province: "Buenos Aires",
      postalCode: "1888",
      country: "Argentina",
      full: "Av. Gral. San Martín 1574, Florencio Varela, Buenos Aires (CP 1888)",
      googleMapsEmbedUrl:
        "https://maps.google.com/maps?q=Av.%20Gral.%20San%20Mart%C3%ADn%201574,%20Florencio%20Varela,%20Buenos%20Aires&t=&z=16&ie=UTF8&iwloc=&output=embed",
      googleMapsDirectUrl:
        "https://www.google.com/maps/search/?api=1&query=Av.+Gral.+San+Martin+1574+Florencio+Varela+Buenos+Aires",
    },
    contact: {
      whatsappNumber: "5491178944996",
      whatsappDisplay: "+54 11 7894-4996",
      whatsappUrl: "https://wa.me/5491178944996",
      phones: [
        { label: "Línea Principal / WhatsApp", display: "11 7894-4996", href: "tel:+5491178944996" },
        { label: "Teléfono Adicional", display: "221 363-8369", href: "tel:+5492213638369" },
      ],
      instagram: {
        handle: "@keycar.cerrajeria",
        url: "https://instagram.com/keycar.cerrajeria",
      },
      facebook: {
        handle: "keycar.cerrajeria",
        url: "https://facebook.com/keycar.cerrajeria",
      },
      schedule: "Atención las 24 hs",
      comingSoon: "Llaves para el hogar",
    },
  },

  // Contadores editables (placeholders razonables listos para ajustar desde código o panel /admin/configuracion)
  stats: [
    {
      id: "llaves-realizadas",
      value: 2000,
      prefix: "+",
      suffix: "",
      label: "Llaves y controles",
      description: "Programaciones, copias codificadas y reparaciones realizadas",
      editableNote: "Placeholder editable en src/config/site.ts o Panel Admin",
    },
    {
      id: "atencion-24hs",
      value: 24,
      prefix: "",
      suffix: " hs",
      label: "Atención continua",
      description: "Disponibilidad para urgencias de cerrajería automotriz",
      editableNote: "Horario oficial de atención",
    },
    {
      id: "marcas-trabajadas",
      value: 16,
      prefix: "",
      suffix: "+",
      label: "Marcas automotrices",
      description: "Cobertura multimarca nacional e importada con diagnóstico",
      editableNote: "Cantidad de marcas principales en catálogo",
    },
    {
      id: "precision-equipos",
      value: 100,
      prefix: "",
      suffix: "%",
      label: "Equipos de última generación",
      description: "Lectura de transponder, clonación y tallado electrónico",
      editableNote: "Equipamiento electrónico dedicado",
    },
  ] as CounterStatItem[],

  services: [
    {
      id: "srv-copias",
      slug: "copias-de-llaves",
      title: "Copias de llaves",
      shortTitle: "Copia de llave",
      slogan: "Todas las marcas y modelos",
      description:
        "Realizamos duplicados precisos para todas las marcas automotrices. Desde llaves convencionales hasta llaves codificadas con chip y telemando integrado.",
      checklist: [
        "Todas las marcas nacionales e importadas",
        "Llaves con chip (transponder) codificadas",
        "Tallado de espadas y cambio de carcasas",
        "Duplicado de controles y llaves navaja",
      ],
      iconName: "KeyRound",
      basePrice: 68000,
      materialCostEstimate: 22000,
    },
    {
      id: "srv-telemandos",
      slug: "programacion-de-telemandos",
      title: "Programación de telemandos",
      shortTitle: "Programación de telemando",
      slogan: "Tu llave siempre funcionando",
      description:
        "Configuración y sincronización de comandos de apertura y cierre a distancia para todas las marcas, con opciones originales y alternativas.",
      checklist: [
        "Apertura y cierre centralizado a distancia",
        "Todas las marcas, originales y alternativos",
        "Sincronización por puerto OBD2 y banco",
        "Trabajo rápido, garantizado y seguro",
      ],
      iconName: "Radio",
      basePrice: 85000,
      materialCostEstimate: 29000,
    },
    {
      id: "srv-clonacion",
      slug: "clonacion-y-transponder",
      title: "Clonación de llaves y lectura de transponder",
      shortTitle: "Clonación y transponder",
      slogan: "Seguridad y confianza",
      description:
        "Lectura electrónica de chips inmovilizadores, generación de transponders y hermanado con el sistema de seguridad original del vehículo.",
      checklist: [
        "Lectura y codificación de llaves con chip",
        "Alta precisión sin dañar la electrónica",
        "Equipos de diagnóstico de última generación",
        "Extracción de PIN Code y programación segura",
      ],
      iconName: "Cpu",
      basePrice: 78000,
      materialCostEstimate: 24000,
    },
    {
      id: "srv-reparacion-controles",
      slug: "reparacion-de-controles",
      title: "Reparación de controles",
      shortTitle: "Reparación de control",
      slogan: "Dale vida a tu control",
      description:
        "Restauramos tu telemando o llave navaja desgastada para que vuelva a funcionar como el primer día, sin necesidad de reemplazar toda la llave.",
      checklist: [
        "Cambio de micro-pulsadores y botones en placa",
        "Reemplazo de carcasas rotas o gastadas",
        "Cambio de espadas, resortes y mecanismos navaja",
        "Control de emisión de frecuencia y batería",
      ],
      iconName: "Wrench",
      basePrice: 36000,
      materialCostEstimate: 9500,
    },
    {
      id: "srv-cierre-centralizado",
      slug: "cierre-centralizado",
      title: "Cierre centralizado",
      shortTitle: "Cierre centralizado",
      slogan: "Comodidad y seguridad",
      description:
        "Diagnóstico integral, reparación y reemplazo de sistemas de cierre centralizado, actuadores de puerta y módulos electrónicos en todas las marcas.",
      checklist: [
        "Reparación y reemplazo de centralitas",
        "Diagnóstico y solución de fallas eléctricas",
        "Revisión de motores actuadores y trabas",
        "Atención a todas las marcas y modelos",
      ],
      iconName: "Lock",
      basePrice: 62000,
      materialCostEstimate: 18500,
    },
    {
      id: "srv-alzacristales",
      slug: "alzacristales",
      title: "Alzacristales",
      shortTitle: "Alzacristales",
      slogan: "Volvé a disfrutar de tu auto",
      description:
        "Solución definitiva cuando no funciona uno o más cristales de tu vehículo. Revisamos desde la botonera hasta la máquina levanta vidrios.",
      checklist: [
        "Reparación y reemplazo de máquinas alzacristales",
        "Solución cuando falla uno o más cristales",
        "Reparación de fichas, módulos y cableados",
        "Reemplazo de motores eléctricos y teclas",
      ],
      iconName: "PanelTop",
      basePrice: 65000,
      materialCostEstimate: 21000,
    },
    {
      id: "srv-cero-llaves",
      slug: "cerrajeria-cero-llaves",
      title: 'Cerrajería "Cero llaves"',
      shortTitle: 'Urgencia "Cero llaves"',
      slogan: "Servicio de emergencia 24 hs",
      description:
        "¿Perdiste todas las llaves de tu auto? Realizamos la apertura sin daños, lectura de combinación mecánica y programación del chip desde cero.",
      checklist: [
        "Resolución ante pérdida total de llaves",
        "Apertura técnica sin dañar cerraduras ni burletes",
        "Confección y tallado de llave desde cero",
        "Anulación de llaves extraviadas y nueva codificación",
      ],
      iconName: "ShieldAlert",
      basePrice: 145000,
      materialCostEstimate: 42000,
      isEmergency: true,
    },
  ] as ServiceCatalogItem[],

  brands: [
    {
      id: "chevrolet",
      name: "Chevrolet",
      slug: "chevrolet",
      logoPath: "/brands/chevrolet.svg",
      popularModels: ["Cruze", "Onix", "Prisma", "Tracker", "S10", "Corsa", "Agile", "Spin"],
    },
    {
      id: "volkswagen",
      name: "Volkswagen",
      slug: "volkswagen",
      logoPath: "/brands/volkswagen.svg",
      popularModels: ["Gol Trend", "Amarok", "Polo", "Vento", "Suran", "Virtus", "T-Cross", "Fox"],
    },
    {
      id: "ford",
      name: "Ford",
      slug: "ford",
      logoPath: "/brands/ford.svg",
      popularModels: ["Ranger", "Focus", "Fiesta Kinetic", "EcoSport", "Ka", "Territory"],
    },
    {
      id: "toyota",
      name: "Toyota",
      slug: "toyota",
      logoPath: "/brands/toyota.svg",
      popularModels: ["Hilux", "Corolla", "Etios", "Yaris", "SW4", "Corolla Cross"],
    },
    {
      id: "renault",
      name: "Renault",
      slug: "renault",
      logoPath: "/brands/renault.svg",
      popularModels: ["Kangoo", "Sandero", "Logan", "Duster", "Kwid", "Clio", "Captur", "Alaskan"],
    },
    {
      id: "peugeot",
      name: "Peugeot",
      slug: "peugeot",
      logoPath: "/brands/peugeot.svg",
      popularModels: ["208", "207 Compact", "308", "Partner", "2008", "408", "307"],
    },
    {
      id: "fiat",
      name: "Fiat",
      slug: "fiat",
      logoPath: "/brands/fiat.svg",
      popularModels: ["Cronos", "Toro", "Palio", "Siena", "Fiorino", "Argo", "Strada", "Mobi"],
    },
    {
      id: "citroen",
      name: "Citroën",
      slug: "citroen",
      logoPath: "/brands/citroen.svg",
      popularModels: ["C3", "C4 Lounge", "Berlingo", "C4 Cactus", "Picasso"],
    },
    {
      id: "nissan",
      name: "Nissan",
      slug: "nissan",
      logoPath: "/brands/nissan.svg",
      popularModels: ["Frontier", "March", "Versa", "Kicks", "Sentra", "Note", "Tiida"],
    },
    {
      id: "honda",
      name: "Honda",
      slug: "honda",
      logoPath: "/brands/honda.svg",
      popularModels: ["HR-V", "Civic", "Fit", "City", "CR-V"],
    },
    {
      id: "hyundai",
      name: "Hyundai",
      slug: "hyundai",
      logoPath: "/brands/hyundai.svg",
      popularModels: ["Tucson", "i10", "Creta", "Santa Fe", "H1"],
    },
    {
      id: "kia",
      name: "Kia",
      slug: "kia",
      logoPath: "/brands/kia.svg",
      popularModels: ["Sportage", "Rio", "Cerato", "Seltos", "Picanto", "K2500"],
    },
    {
      id: "suzuki",
      name: "Suzuki",
      slug: "suzuki",
      logoPath: "/brands/suzuki.svg",
      popularModels: ["Fun", "Swift", "Grand Vitara", "Jimny", "Baleno"],
    },
    {
      id: "jeep",
      name: "Jeep",
      slug: "jeep",
      logoPath: "/brands/jeep.svg",
      popularModels: ["Renegade", "Compass", "Commander", "Cherokee"],
    },
    {
      id: "mercedes-benz",
      name: "Mercedes-Benz",
      slug: "mercedes-benz",
      logoPath: "/brands/mercedes-benz.svg",
      popularModels: ["Sprinter", "Vito", "Clase A", "Clase C", "GLA"],
    },
    {
      id: "bmw",
      name: "BMW",
      slug: "bmw",
      logoPath: "/brands/bmw.svg",
      popularModels: ["Serie 1", "Serie 3", "X1", "X3", "320i"],
    },
  ] as BrandItem[],

  situations: [
    "Perdí todas las llaves",
    "Tengo una sola y quiero copia",
    "Mi control no funciona",
    "Necesito programar",
    "Es una urgencia",
  ],

  howWeWork: [
    {
      step: "01",
      title: "Consulta",
      description:
        "Nos indicás la marca, modelo, año de tu vehículo y el problema desde el cotizador web o directamente por WhatsApp.",
    },
    {
      step: "02",
      title: "Diagnóstico",
      description:
        "Evaluamos el sistema inmovilizador, cerradura, telemando o módulo eléctrico con equipos específicos para tu marca.",
    },
    {
      step: "03",
      title: "Presupuesto",
      description:
        "Te informamos las opciones disponibles (original o alternativa) con un precio claro y sin sorpresas antes de empezar.",
    },
    {
      step: "04",
      title: "Entrega",
      description:
        "Probamos el encendido, cierre centralizado y alcance del control frente a vos para que te lleves tu vehículo 100% operativo.",
    },
  ],

  expenseCategories: [
    "Insumos/llaves en blanco",
    "Herramientas",
    "Alquiler",
    "Servicios",
    "Sueldos",
    "Publicidad",
    "Impuestos",
    "Combustible",
    "Otros",
  ],

  whatsappTemplates: [
    {
      id: "tpl-presupuesto",
      title: "Envío de presupuesto inicial",
      text: "Hola {nombre}! Te escribimos de KeyCar (Cerrajería Automotriz - Florencio Varela). Recibimos tu consulta por {servicio} para tu {vehiculo}. Te comentamos que contamos con stock y equipamiento para realizarlo. ¿Querés que te pasemos las opciones y disponibilidad de turno?",
    },
    {
      id: "tpl-urgencia",
      title: "Respuesta rápida urgencia Cero Llaves",
      text: "Hola {nombre}! Soy del equipo de guardia 24 hs de KeyCar. Recibimos tu urgencia por {vehiculo} en zona {zona}. Pasame por favor la ubicación exacta y una foto del vehículo o cédula para coordinar la asistencia inmediata.",
    },
    {
      id: "tpl-listo",
      title: "Aviso de vehículo / llave lista",
      text: "Hola {nombre}! Te avisamos de KeyCar que el trabajo de {servicio} en tu {vehiculo} ya está finalizado y probado. Podés pasar a retirarlo por Av. Gral. San Martín 1574, Florencio Varela.",
    },
    {
      id: "tpl-seguimiento",
      title: "Seguimiento de consulta",
      text: "Hola {nombre}, ¿cómo estás? Te escribimos de KeyCar para saber si pudiste resolver el tema de {servicio} en tu {vehiculo} o si querés reservar un turno esta semana. Quedamos a disposición!",
    },
  ],
};
