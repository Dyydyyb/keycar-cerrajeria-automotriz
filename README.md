# KeyCar — Especialistas en Llaves Automotrices (Florencio Varela)

Landing Page corporativa + Sistema de Gestión Privado (`/admin`: Dashboard Analítico, CRM de Clientes, Pipeline Kanban de Consultas, Gestión de Trabajos, Finanzas y Reportes CSV/PDF) para **KeyCar Cerrajería Automotriz** (`Av. Gral. San Martín 1574, Florencio Varela, Buenos Aires`).

---

## 1. Stack Técnico

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Estilos e Identidad Visual**: Tailwind CSS con paleta corporativa sobria (`#FFFFFF`, `#F5F7FA`, `#1473E6`, `#0B1B2E`, `#0F5BB8`, `#4A5568`, `#E2E8F0`, `#25D366` mate; cero neón, cero glow)
- **Tipografías**: `Montserrat` (títulos bold/extrabold) + `Inter` (cuerpo) vía `next/font/google`
- **Animaciones**: Framer Motion (con soporte `prefers-reduced-motion`)
- **Gráficos Analíticos**: Recharts (6 visualizaciones interactivas en Dashboard + 2 en Finanzas)
- **Validaciones**: Zod
- **Modelo de Datos**: Prisma ORM (`prisma/schema.prisma`, SQLite local fácil de migrar a PostgreSQL) + Capa reactiva isomórfica pre-cargada con **60 clientes**, **210 trabajos** de varios meses, **transacciones financieras** y **28 consultas** lista para funcionar sin fricción en **Vercel Serverless**.

---

## 2. Instalación y Comandos

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env

# 3. (Opcional) Sincronizar esquema SQLite local con Prisma y correr seed
npm run db:push
npm run db:seed

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Compilar para producción (Vercel)
npm run build
npm start
```

---

## 3. Variables de Entorno (`.env.example`)

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="keycar-secret-key-florencio-varela-2026-change-in-prod"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@keycar.com.ar"
ADMIN_PASSWORD="KeyCar2026!"
NEXT_PUBLIC_WHATSAPP_NUMBER="5491178944996"
NEXT_PUBLIC_SITE_URL="https://keycar.vercel.app"
```

---

## 4. Credenciales del Panel Admin (`/admin`)

- **Ruta de acceso**: `/admin/login` (todas las rutas `/admin/*` están protegidas por `src/middleware.ts`)
- **Email inicial (Seed)**: `admin@keycar.com.ar`
- **Contraseña inicial (Seed)**: `KeyCar2026!`
- **Cómo cambiar las credenciales**:
  1. En producción mediante las variables de entorno `ADMIN_EMAIL` y `ADMIN_PASSWORD` en Vercel.
  2. O directamente desde la interfaz en **`/admin/configuracion` → Seguridad y Usuario Administrador**.

---

## 5. Personalización de Logo, Textos, Contadores y Marcas

- **Cambiar el Logo**:
  Reemplazá el archivo `/public/logo.png` conservando el nombre. El componente reutilizable `<Logo />` (`src/components/ui/Logo.tsx`) se encarga de renderizarlo automáticamente en Navbar, Hero, Footer, Login, Sidebar Admin y Reportes Imprimibles.
- **Editar Servicios, Textos, Teléfonos y Contadores (`+2000 llaves`, `24 hs`, `16+ marcas`)**:
  - Desde código en `src/config/site.ts`.
  - O en vivo desde el panel **`/admin/configuracion`**.
- **Logos de Marcas Automotrices**:
  Ubicados en `/public/brands/*.svg` para las 16 marcas trabajadas (Chevrolet, Volkswagen, Ford, Toyota, Renault, Peugeot, Fiat, Citroën, Nissan, Honda, Hyundai, Kia, Suzuki, Jeep, Mercedes-Benz y BMW).

---

## 6. Despliegue en Vercel

El proyecto está 100% preparado para **Vercel**:
1. Importá el repositorio de GitHub en [Vercel](https://vercel.com/new).
2. Framework Preset: **Next.js** (detectado automáticamente).
3. Configurá opcionalmente `ADMIN_EMAIL` y `ADMIN_PASSWORD` en *Environment Variables*.
4. Hacé clic en **Deploy**.
