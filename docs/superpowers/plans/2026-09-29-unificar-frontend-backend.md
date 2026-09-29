# Plan de Unificación: Frontend y Backend (OficiosYa / Compra Venta Jáchal)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unificar en una estructura de monorepo limpia y desacoplada el frontend (`oficiosya-frontend`) y el backend (`oficiosya`) con Supabase, configurando scripts raíz, variables de entorno, CORS y capa de comunicación API.

**Architecture:** Monorepo compuesto por dos aplicaciones independientes: `backend/` (Node.js, Express, Zod, Supabase, Jest) y `frontend/` (React 19, TypeScript, Vite, CSS Modules), junto con el directorio `supabase/` para migraciones y esquema de base de datos. Un `package.json` raíz orquesta la ejecución y dependencias concurrentes.

**Tech Stack:** 
- Frontend: React 19, TypeScript, Vite 8, React Router DOM 7, CSS Modules, Oxlint
- Backend: Node.js (ESM), Express 5, Supabase JS, Helmet, CORS, Zod, Jest, Supertest, Swagger
- Database: Supabase PostgreSQL & Migrations

---

## Global Constraints

- Backend corre en puerto configurable (default `3000` o `3001`) con soporte ESM (`"type": "module"`).
- Frontend corre en Vite (default `5173`) con TypeScript estricto y comunicación vía variable `VITE_API_URL`.
- Raíz del proyecto orquesta `dev`, `build`, `lint`, `test` sin romper la independencia de ejecución individual de cada paquete.
- No incluir secretos reales en repositorios (`.env` siempre en `.gitignore`).

## Review Focus

1. **CORS:** El backend debe aceptar peticiones explícitamente desde el origen del frontend (`http://localhost:5173` o configurado por `CORS_ORIGIN`).
2. **Variables de Entorno:** Ambos proyectos deben tener `.env.example` sincronizados y claros para desarrollo local.
3. **Manejo de Errores de Conexión:** El frontend debe manejar de forma elegante cuando el backend o Supabase no estén disponibles o devuelvan errores HTTP (4xx/5xx).
4. **Scripts de Ejecución:** `npm run dev` desde la raíz debe iniciar simultáneamente frontend y backend sin colisiones ni fallos de puerto.
5. **Tipado y Modelos:** Las interfaces TypeScript en `frontend/src/types/` deben ser compatibles con los esquemas de datos expuestos por la API del backend.

---

### Task 1: Reestructuración de Directorios y Configuración Monorepo

**Files:**
- Create: `package.json` (raíz)
- Create: `.gitignore` (raíz)
- Create: `README.md` (raíz)
- Modify: limpieza de carpetas temporales

**Interfaces:**
- Raíz orquesta scripts: `npm run dev`, `npm run dev:backend`, `npm run dev:frontend`, `npm run install:all`, `npm run test`, `npm run lint`.

- [ ] **Step 1: Crear `package.json` raíz con concurrently / npm workspaces**
  Configurar scripts para instalar dependencias y correr ambos servicios:
  ```json
  {
    "name": "compra-venta-jachal",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "install:all": "npm install && npm install --prefix backend && npm install --prefix frontend",
      "dev": "concurrently -n \"backend,frontend\" -c \"blue,green\" \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\"",
      "dev:backend": "npm run dev --prefix backend",
      "dev:frontend": "npm run dev --prefix frontend",
      "build:frontend": "npm run build --prefix frontend",
      "test:backend": "npm run test --prefix backend",
      "lint": "npm run lint --prefix frontend"
    },
    "devDependencies": {
      "concurrently": "^9.1.2"
    }
  }
  ```

- [ ] **Step 2: Crear `.gitignore` unificado**
  ```gitignore
  # Dependencies
  node_modules/
  /.pnp
  .pnp.js

  # Production build
  dist/
  dist-ssr/
  build/

  # Environment files
  .env
  .env.local
  .env.*.local

  # Logs
  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*
  pnpm-debug.log*
  lerna-debug.log*

  # OS Files
  .DS_Store
  Thumbs.db

  # IDEs
  .vscode/
  .idea/
  *.suo
  *.ntvs*
  *.njsproj
  *.sln
  *.sw?

  # Temporary folders
  temp_frontend/
  temp_backend/
  ```

- [ ] **Step 3: Documentar `README.md` con instrucciones de arranque rápido**
  Documentar requisitos de Node, configuración de `.env` para backend y frontend, y comandos disponibles.

---

### Task 2: Integración y Configuración del Backend & Supabase

**Files:**
- Move/Create: `backend/` (código migrado desde `temp_backend/backend`)
- Move/Create: `supabase/` (migrado desde `temp_backend/supabase`)
- Modify: `backend/src/app.js` (asegurar configuración CORS adecuada)
- Modify: `backend/.env.example`

**Interfaces:**
- Consumes: Configuración de variables de entorno (`PORT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `CORS_ORIGIN`).
- Produces: API REST en `http://localhost:3000/api` con Swagger en `/api/docs`.

- [ ] **Step 1: Migrar archivos de backend y supabase al proyecto principal**
  Copiar estructura de `src/`, `test/`, `package.json`, `supabase/migrations/` y `supabase/config.toml`.

- [ ] **Step 2: Configurar CORS y variables en `backend/src/app.js` y `backend/.env.example`**
  Asegurar que el middleware de CORS permita peticiones desde `process.env.CORS_ORIGIN || 'http://localhost:5173'`.

- [ ] **Step 3: Ejecutar instalación de dependencias y pruebas de backend**
  Run: `npm install --prefix backend`
  Run: `npm run test --prefix backend`
  Expected: PASS (los tests unitarios y de salud pasan correctamente).

---

### Task 3: Integración y Configuración del Frontend TypeScript

**Files:**
- Replace/Create: `frontend/` (actualizado con el código TypeScript de `oficiosya-frontend`)
- Modify: `frontend/vite.config.ts`
- Modify: `frontend/.env.example`
- Modify: `frontend/.env`

**Interfaces:**
- Consumes: `VITE_API_URL` (ej. `http://localhost:3000/api`).
- Produces: Single Page Application React 19 + TypeScript.

- [ ] **Step 1: Migrar código de frontend TypeScript**
  Reemplazar el frontend anterior con el nuevo frontend TypeScript completo (`src/`, `components/`, `pages/`, `types/`, `styles/`, etc.).

- [ ] **Step 2: Configurar `.env.example` y `vite.config.ts`**
  Definir `VITE_API_URL=http://localhost:3000/api` en `frontend/.env.example`.

- [ ] **Step 3: Instalar dependencias y verificar compilación TypeScript**
  Run: `npm install --prefix frontend`
  Run: `npm run build --prefix frontend`
  Expected: Build exitoso sin errores de tipos.

---

### Task 4: Conexión Frontend - Backend (Servicio API y Endpoints)

**Files:**
- Modify: `frontend/src/services/api.ts`
- Create/Modify: `frontend/src/services/categoriesService.ts`
- Create/Modify: `frontend/src/services/workersService.ts`
- Modify: `frontend/src/pages/Home.tsx` / `CategoryPage.tsx` para consumir la API real con fallback controlado

**Interfaces:**
- Consumes: Endpoints `/api/categories`, `/api/providers`, `/api/services`.
- Produces: Hooks y llamadas fetch tipadas hacia el backend.

- [ ] **Step 1: Mejorar cliente HTTP base `frontend/src/services/api.ts`**
  Incluir manejo de cabeceras, soporte para errores formateados y timeout/fallback.

- [ ] **Step 2: Implementar servicio de categorías conectado a `/api/categories`**
  Crear función `getCategories()` que llame a la API del backend y use mocks en caso de no haber conexión en desarrollo.

- [ ] **Step 3: Implementar servicio de proveedores/trabajadores conectado a `/api/providers`**
  Crear función `getProviders(query)` conectada a los endpoints del backend.

---

### Task 5: Limpieza, Scripts de Raíz y Verificación Final End-to-End

**Files:**
- Delete: directorios temporales `temp_frontend/`, `temp_backend/`
- Modify: `package.json`

- [ ] **Step 1: Eliminar carpetas temporales de clonación**
  Limpiar `temp_frontend` y `temp_backend`.

- [ ] **Step 2: Probar ejecución orquestada en desarrollo**
  Run: `npm install` (instala concurrently en raíz)
  Run: `npm run dev:backend` (verificar arranque)
  Run: `npm run dev:frontend` (verificar arranque)

- [ ] **Step 3: Verificación integral de builds y tests**
  Run: `npm run build:frontend`
  Run: `npm run test:backend`
  Expected: Todo verde / pasando.
