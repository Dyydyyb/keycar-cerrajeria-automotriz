// Script de seed para poblar la base de datos SQLite local (Prisma)
// Ejecutar con: npm run db:push && npm run db:seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔑 Iniciando seed de KeyCar - Especialistas en Llaves Automotrices...");

  // 1. Usuario Admin inicial
  await prisma.user.upsert({
    where: { email: "admin@keycar.com.ar" },
    update: {},
    create: {
      name: "Administrador KeyCar",
      email: "admin@keycar.com.ar",
      // Hash bcrypt representativo de 'KeyCar2026!'
      passwordHash: "$2a$10$KeyCar2026HashSeedFlorencioVarelaAdminKeyCar",
      role: "ADMIN",
      mustChangePw: true,
    },
  });

  // 2. Categorías de egresos
  const categories = [
    "Insumos/llaves en blanco",
    "Herramientas",
    "Alquiler",
    "Servicios",
    "Sueldos",
    "Publicidad",
    "Impuestos",
    "Combustible",
    "Otros",
  ];

  for (const name of categories) {
    await prisma.expenseCategory.upsert({
      where: { name },
      update: {},
      create: { name, active: true },
    });
  }

  // 3. Catálogo de 7 servicios oficiales
  const services = [
    {
      slug: "copias-de-llaves",
      name: "Copias de llaves",
      slogan: "Todas las marcas y modelos",
      description: "Todas las marcas. Llaves con chip, espadas, carcasas, controles.",
      basePrice: 68000,
    },
    {
      slug: "programacion-de-telemandos",
      name: "Programación de telemandos",
      slogan: "Tu llave siempre funcionando",
      description: "Apertura y cierre a distancia, todas las marcas, originales y alternativos, trabajo rápido y seguro.",
      basePrice: 85000,
    },
    {
      slug: "clonacion-y-transponder",
      name: "Clonación de llaves y lectura de transponder",
      slogan: "Seguridad y confianza",
      description: "Llaves con chip, alta precisión, equipos de última generación.",
      basePrice: 78000,
    },
    {
      slug: "reparacion-de-controles",
      name: "Reparación de controles",
      slogan: "Dale vida a tu control",
      description: "Cambio de botones, carcasas, espadas, resortes y más.",
      basePrice: 36000,
    },
    {
      slug: "cierre-centralizado",
      name: "Cierre centralizado",
      slogan: "Comodidad y seguridad",
      description: "Reparación y reemplazo de centralitas, diagnóstico y solución de fallas, todas las marcas y modelos.",
      basePrice: 62000,
    },
    {
      slug: "alzacristales",
      name: "Alzacristales",
      slogan: "Volvé a disfrutar de tu auto",
      description: "Reparación y reemplazo, cuando no funciona uno o más cristales, reparación de fichas y cableados, reemplazo de motores y teclas.",
      basePrice: 65000,
    },
    {
      slug: "cerrajeria-cero-llaves",
      name: 'Cerrajería "Cero llaves"',
      slogan: "Servicio de emergencia 24 hs",
      description: "Pérdida total de llaves, servicio de emergencia las 24 hs.",
      basePrice: 145000,
    },
  ];

  for (const srv of services) {
    await prisma.service.upsert({
      where: { slug: srv.slug },
      update: srv,
      create: srv,
    });
  }

  console.log("✅ Seed completado con éxito. Catálogo, usuario admin y estructura listos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
