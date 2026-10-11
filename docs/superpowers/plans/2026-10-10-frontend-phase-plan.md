# 🗺️ Plan Integral por Fases: Finalización del Frontend (OficiosYa & Jáchal Vende)

> **Objetivo:** Completar al 100% la interfaz, interactividad, flujos de usuario y experiencia visual de ambos portales (OficiosYa y Marketplace Compra-Venta), dejándolos completamente navegables, funcionales y listos para producción.

---

## 📌 Resumen de Fases

```mermaid
flowchart LR
    F1["🔨 Fase 1:<br>OficiosYa (Vistas Core)"] --> F2["🛍️ Fase 2:<br>Marketplace & Filtros"]
    F2 --> F3["🔐 Fase 3:<br>Auth & Navegación Global"]
    F3 --> F4["✨ Fase 4:<br>Diseño, Feedback & Polish"]
```

---

## 🔨 FASE 1: Vistas y Flujos Core de OficiosYa (Servicios & Profesionales)

### 🎯 Objetivo:
Resolver los enlaces rotos (404s) y habilitar la experiencia completa para descubrir, ver en detalle, contactar profesionales y registrarse como trabajador.

#### 📋 Tareas:
- [x] **1.1 Página de Detalle del Trabajador (`/worker/:id`):**
  - Vista completa del perfil del profesional con avatar/foto, insignia de verificación, biografía y especialidades.
  - Zonas de cobertura en Jáchal (Centro, Niquivil, Villa Mercedes, Huaco, Pampa Vieja, etc.).
  - Botón directo de **WhatsApp** con mensaje preconfigurado.
  - Botón y disparador para **«Solicitar Presupuesto / Servicio»**.
  - Lista de reseñas y calificaciones con estrellas.
  - ⭐ **Modal de calificación interactivo** (`ReviewModal.tsx`) con recálculo dinámico.
  - ❤️ **Botón de guardado a favoritos** integrado.
  - 🔗 **Botón de compartir y copiar enlace** directo.
- [x] **1.2 Modal / Formulario de Solicitud de Servicio:**
  - Componente modal interactivo para enviar solicitudes de trabajo (`ServiceRequestModal.tsx`).
  - Campos: Descripción de la tarea, dirección/zona en Jáchal, nivel de urgencia y fotos.
  - Confirmación visual de solicitud enviada.
- [x] **1.3 Página de Registro de Trabajador (`/registro-trabajador`):**
  - Formulario de incorporación para prestadores de oficios con categorías, zonas y fotos.

---

## 🛍️ FASE 2: Perfeccionamiento y Filtros de Marketplace (Compra-Venta)

### 🎯 Objetivo:
Elevar la experiencia de compra y venta, añadiendo filtros avanzados, gestión integral de publicaciones del usuario y previsualización de imágenes.

### 📋 Tareas:
- [x] **2.1 Filtros Dinámicos y Ordenamiento en `Home.tsx` (Marketplace):**
  - Barra de búsqueda combinada con selector rápido de categorías.
  - Filtro por rango de precios (Mínimo - Máximo) y filtro por localidad/zona de Jáchal.
  - Selector de ordenamiento: *Más recientes*, *Menor precio*, *Mayor precio*.
  - Estado visual cuando no hay resultados (*Empty State* amigable).
- [x] **2.2 Previsualización de Imágenes en Publicación (`Publish.tsx`):**
  - Carga múltiple con vista previa de miniaturas (thumbnails) antes de enviar.
  - Botón para eliminar o reordenar fotos subidas.
- [x] **2.3 Gestión Activa de Publicaciones en Perfil (`Profile.tsx`):**
  - Visualización ordenada de las publicaciones del usuario.
  - ✏️ **Modal de edición de publicaciones** (`EditProductModal.tsx`): Modificación de título, precio, categoría, ubicación y descripción.
  - 🗑️ **Eliminación de publicaciones** con confirmación y sincronización en `localStorage`.

---

## 🔐 FASE 3: Unificación de Autenticación, Navegación y Notificaciones

### 🎯 Objetivo:
Crear una experiencia de usuario cohesionada entre ambos portales (un solo login, barra de navegación sincronizada y feedback visual).

### 📋 Tareas:
- [x] **3.1 AuthContext Global y Compartido:**
  - Sesión persistente con token JWT y datos de perfil en `localStorage`.
  - Soporte de resiliencia ante backend offline.
- [x] **3.2 Sincronización de Navegación (`Navbar.tsx` & `AppRoutes.tsx`):**
  - Conmutador integrado entre OficiosYa y Jáchal Vende.
  - Menú de usuario autenticado en Navbar.
  - ❤️ **Sistema de Favoritos centralizado** con ruta `/favoritos` y badge dinámico en ambos Navbars.
- [x] **3.3 Sistema de Notificaciones Toast (`ToastContext.tsx`):**
  - Avisos flotantes elegantes para éxito, error y alertas.
  - Mecanismo de deduplicación y cooldown contra doble notificación.

---

## ✨ FASE 4: Consistencia de Diseño, Modo Oscuro y Pulido Final

### 🎯 Objetivo:
Garantizar una estética profesional, fluida y 100% responsiva para dispositivos móviles y de escritorio.

### 📋 Tareas:
- [x] **4.1 Consistencia Visual y Maquetación:**
  - Rediseño de `ProductDetail.tsx` (encuadre equilibrado de fotos, panel de acciones pulido).
  - Rediseño de `Profile.tsx` (cabecera con tokens de diseño, botones circulares de acción).
- [ ] **4.2 Estados de Carga y Skeletons:**
  - Añadir pantallas de carga elegantes (*Skeleton loaders*) mientras se consultan datos en catálogos y búsquedas.
- [ ] **4.3 Auditoría de Responsive Mobile-First:**
  - Ajustes de padding y táctiles en formularios y modales en teléfonos pequeños.
- [ ] **4.4 Modo Oscuro Pulido:**
  - Revisar contraste de textos y bordes en tema nocturno en las nuevas vistas de detalle y perfil.
