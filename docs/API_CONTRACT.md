# 📄 Contrato de Integración de API (Frontend ↔ Backend)
**Plataforma Integral:** *OficiosYa & Jáchal Vende*  
**Destinatario:** Equipo de Backend  
**Versión de la API:** `v1`  
**Base URL esperada:** `http://localhost:3000/api` (o variable de entorno `VITE_API_URL`)  
**Formato de Intercambio:** `JSON` (UTF-8) / `multipart/form-data` (para subida de fotos)

---

## 📌 1. Principios de Diseño y Convenciones

1. **Autenticación:**
   - La API utiliza tokens Bearer JWT:  
     `Authorization: Bearer <token>`
   - Las respuestas exitosas devuelven códigos HTTP `200` o `201`.
2. **Estructura Estándar de Respuestas:**
   - **Éxito:**
     ```json
     {
       "success": true,
       "data": { ... }
     }
     ```
   - **Error:**
     ```json
     {
       "success": false,
       "message": "Descripción clara del error",
       "errors": [
         { "field": "email", "message": "El formato del email no es válido" }
       ]
     }
     ```
3. **Resiliencia del Frontend:**
   - El frontend cuenta con almacenamiento y mock-data reactiva (`localStorage`). Cuando el backend esté listo y desplegado con base de datos, el frontend consumirá estos endpoints de forma transparente sin requerir cambios estructurales.

---

## 🔐 2. Autenticación y Usuarios (`/auth`)

### 2.1 Registro de Usuario
- **Ruta:** `POST /auth/register`
- **Público:** Sí
- **Body (JSON):**
  ```json
  {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@jachal.com",
    "password": "Password123",
    "phone": "2645112233",
    "location": "San José de Jáchal"
  }
  ```
  *(Nota: La contraseña debe tener al menos 8 caracteres).*
- **Respuesta Exitosa (`201 Created`):**
  ```json
  {
    "token": "eyJhbGciOi...",
    "_id": "67040a1b...",
    "name": "Juan Pérez",
    "email": "juan@jachal.com",
    "phone": "2645112233",
    "location": "San José de Jáchal"
  }
  ```

### 2.2 Inicio de Sesión
- **Ruta:** `POST /auth/login`
- **Público:** Sí
- **Body (JSON):**
  ```json
  {
    "email": "juan@jachal.com",
    "password": "Password123"
  }
  ```
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "token": "eyJhbGciOi...",
    "_id": "67040a1b...",
    "name": "Juan Pérez",
    "email": "juan@jachal.com",
    "phone": "2645112233",
    "location": "San José de Jáchal"
  }
  ```

### 2.3 Obtener Usuario en Sesión
- **Ruta:** `GET /auth/me`
- **Encabezado:** `Authorization: Bearer <token>`
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "_id": "67040a1b...",
    "name": "Juan Pérez",
    "email": "juan@jachal.com",
    "phone": "2645112233",
    "location": "San José de Jáchal"
  }
  ```

---

## 🛍️ 3. Módulo Compra-Venta / Marketplace (`/products`)

### 3.1 Listar Productos (Catálogo)
- **Ruta:** `GET /products`
- **Parámetros de consulta (Query Params):**
  - `category` *(opcional)*: `vehiculos`, `inmuebles`, `tecnologia`, `hogar`, `deportes`, `otros`.
  - `search` *(opcional)*: Término de búsqueda (busca en título y ubicación).
- **Respuesta Exitosa (`200 OK`):**
  ```json
  [
    {
      "_id": "prod-1",
      "title": "Volkswagen Gol Trend 1.6",
      "price": 8500000,
      "category": "vehiculos",
      "location": "Centro, Jáchal",
      "description": "75.000 km, papeles al día.",
      "images": [
        { "url": "https://..." }
      ],
      "createdAt": "2026-10-10T12:00:00.000Z",
      "user": {
        "name": "Carlos Gómez",
        "phone": "2645112233",
        "location": "Centro, Jáchal",
        "isVerified": true
      }
    }
  ]
  ```

### 3.2 Detalle de Producto
- **Ruta:** `GET /products/:id`
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "_id": "prod-1",
    "title": "Volkswagen Gol Trend 1.6",
    "price": 8500000,
    "category": "vehiculos",
    "location": "Centro, Jáchal",
    "description": "Excelente estado...",
    "images": [{ "url": "https://..." }],
    "createdAt": "2026-10-10T12:00:00.000Z",
    "user": {
      "name": "Carlos Gómez",
      "phone": "2645112233",
      "location": "Centro, Jáchal",
      "isVerified": true
    }
  }
  ```

### 3.3 Publicar Nuevo Producto
- **Ruta:** `POST /products`
- **Encabezado:** `Authorization: Bearer <token>`
- **Content-Type:** `multipart/form-data` o `application/json`
- **Campos esperados:**
  - `title` *(string, obligatorio)*
  - `price` *(number, obligatorio)*
  - `category` *(string, obligatorio)*
  - `location` *(string, obligatorio)*
  - `description` *(string, obligatorio)*
  - `images` *(archivos binarios de imagen o URLs)*
- **Respuesta Exitosa (`201 Created`):**
  ```json
  {
    "_id": "prod-99",
    "title": "Bicicleta Venzo R29",
    "price": 280000,
    "category": "deportes",
    "location": "Niquivil",
    "description": "Cuadro de aluminio...",
    "images": [{ "url": "https://..." }],
    "createdAt": "2026-10-10T22:00:00.000Z"
  }
  ```

### 3.4 Modificar Publicación Existente (Nuevo requerimiento Frontend)
- **Ruta:** `PUT /products/:id`
- **Encabezado:** `Authorization: Bearer <token>`
- **Body (JSON):**
  ```json
  {
    "title": "Volkswagen Gol Trend 1.6 (Precio Actualizado)",
    "price": 8200000,
    "category": "vehiculos",
    "location": "Centro, Jáchal",
    "description": "Rebajado esta semana, papeles al día.",
    "images": [{ "url": "https://..." }]
  }
  ```
- **Respuesta Exitosa (`200 OK`):** Objeto del producto con los datos modificados.

### 3.5 Eliminar Publicación
- **Ruta:** `DELETE /products/:id`
- **Encabezado:** `Authorization: Bearer <token>`
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Publicación eliminada correctamente"
  }
  ```

### 3.6 Publicaciones del Usuario Autenticado
- **Ruta:** `GET /products/user/my-listings`
- **Encabezado:** `Authorization: Bearer <token>`
- **Respuesta Exitosa (`200 OK`):** Array con los productos creados por el usuario en sesión.

---

## 🔨 4. Módulo OficiosYa / Prestadores de Servicios (`/providers` o `/workers`)

### 4.1 Listar Profesionales
- **Ruta:** `GET /providers`
- **Query Params:**
  - `category` *(opcional)*: ID de la categoría (ej: `plomeria`, `electricidad`, `carpinteria`).
  - `search` *(opcional)*: Búsqueda por nombre o descripción.
- **Respuesta Exitosa (`200 OK`):**
  ```json
  [
    {
      "id": "1",
      "name": "Roberto Sánchez",
      "profession": "Plomero y Gasista Matriculado",
      "categoryIds": ["plomeria", "gas"],
      "zones": ["Centro", "Villa Mercedes", "Niquivil"],
      "phone": "2645112233",
      "averageRating": 4.8,
      "reviewCount": 14,
      "avatar": "https://...",
      "isVerified": true
    }
  ]
  ```

### 4.2 Detalle de Profesional
- **Ruta:** `GET /providers/:id`
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "id": "1",
    "name": "Roberto Sánchez",
    "profession": "Plomero y Gasista Matriculado",
    "bio": "Más de 15 años de experiencia en instalaciones de agua y gas...",
    "zones": ["Centro", "Villa Mercedes", "Niquivil"],
    "phone": "2645112233",
    "averageRating": 4.8,
    "reviewCount": 14,
    "isVerified": true,
    "ratings": [
      {
        "id": "rev-1",
        "clientName": "Ana Morales",
        "score": 5,
        "comment": "Puntual, resolvió la pérdida en el día. Muy recomendable.",
        "date": "2026-10-05T14:30:00.000Z"
      }
    ]
  }
  ```

### 4.3 Agregar Reseña / Calificación a un Profesional (Nuevo requerimiento Frontend)
- **Ruta:** `POST /providers/:id/ratings`
- **Encabezado:** *(Opcional autenticado o público con nombre)*
- **Body (JSON):**
  ```json
  {
    "clientName": "Carlos Tapia",
    "score": 5,
    "comment": "Excelente trabajo y atención, muy prolijo."
  }
  ```
- **Respuesta Exitosa (`201 Created`):**
  ```json
  {
    "success": true,
    "rating": {
      "id": "rating-179168...",
      "clientName": "Carlos Tapia",
      "score": 5,
      "comment": "Excelente trabajo y atención, muy prolijo.",
      "date": "2026-10-10T22:30:00.000Z"
    },
    "worker": {
      "id": "1",
      "averageRating": 4.9,
      "reviewCount": 15
    }
  }
  ```

### 4.4 Registro de Nuevo Profesional
- **Ruta:** `POST /providers`
- **Body (JSON o Multipart):**
  ```json
  {
    "name": "Mariana Gómez",
    "profession": "Electricista Instaladora",
    "categoryIds": ["electricidad"],
    "phone": "2645778899",
    "zones": ["Centro", "Pampa Vieja"],
    "bio": "Instalaciones eléctricas residenciales y comerciales con garantía."
  }
  ```

---

## 📋 Resumen de Puntos de Acción para Backend
1. **Verificar endpoints CRUD de Productos:** Habilitar especialmente `PUT /products/:id` para la edición de publicaciones.
2. **Habilitar Endpoint de Calificaciones:** Proveer `POST /providers/:id/ratings` con recálculo automático del promedio de estrellas (`averageRating`) y contador (`reviewCount`).
3. **Manejo de CORS:** Asegurar que el backend permita peticiones desde `http://localhost:5173` y los dominios de despliegue frontend.
