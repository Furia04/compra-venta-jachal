# Compra Venta Jáchal / OficiosYa

Proyecto unificado que integra la plataforma de servicios y oficios con arquitectura cliente-servidor desacoplada.

## 🚀 Estructura del Proyecto

```text
├── backend/       # API REST con Express 5, Node.js, Zod y Supabase
├── frontend/      # SPA construida con React 19, TypeScript, Vite y CSS Modules
├── supabase/      # Migraciones y configuraciones de base de datos Supabase
├── package.json   # Orquestador de scripts monorepo (npm run dev, etc.)
└── README.md
```

## 🛠️ Requisitos Previos

- **Node.js**: v20+ recomendado
- **npm**: v10+

## ⚙️ Configuración de Variables de Entorno

1. **Backend**:
   Copiar `backend/.env.example` a `backend/.env` y configurar las credenciales de Supabase y el puerto:
   ```bash
   PORT=3000
   SUPABASE_URL=https://your-supabase-url.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   CORS_ORIGIN=http://localhost:5173
   ```

2. **Frontend**:
   Copiar `frontend/.env.example` a `frontend/.env`:
   ```bash
   VITE_API_URL=http://localhost:3000/api
   ```

## 📦 Instalación

Para instalar todas las dependencias (raíz, backend y frontend):
```bash
npm run install:all
```

## 💻 Ejecución en Desarrollo

Para levantar frontend y backend concurrentemente:
```bash
npm run dev
```

O individualmente:
- Backend: `npm run dev:backend` (corre en `http://localhost:3000`)
- Frontend: `npm run dev:frontend` (corre en `http://localhost:5173`)

## 🧪 Pruebas y Construcción

- **Pruebas de Backend**: `npm run test:backend`
- **Build de Frontend**: `npm run build:frontend`
- **Linter Frontend**: `npm run lint`
