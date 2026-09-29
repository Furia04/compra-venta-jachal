import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from './config/env.js';

// Importación de las rutas modulares de la aplicación
import authRoutes from './routes/auth.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import profilesRoutes from './routes/profiles.routes.js';
import providersRoutes from './routes/providers.routes.js';
import servicesRoutes from './routes/services.routes.js';
import providerServicesRoutes from './routes/provider-services.routes.js';
import serviceRequestsRoutes from './routes/service-requests.routes.js';

// Middleware global para manejo centralizado de errores
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

/**
 * ============================================================================
 * CONFIGURACIÓN DE MIDDLEWARES GLOBALES
 * ============================================================================
 */

// Helmet añade cabeceras HTTP seguras para proteger la API contra vulnerabilidades comunes
app.use(helmet());

// CORS permite peticiones cruzadas desde el cliente frontend configurado
app.use(cors({
  origin: env.corsOrigin,
  credentials: true
}));

// Parser para procesar cuerpos de petición en formato JSON
app.use(express.json());

/**
 * ============================================================================
 * RUTAS DEL SISTEMA
 * ============================================================================
 */

/**
 * Endpoint de estado de salud (Health Check)
 * Permite verificar si la API está en línea y respondiendo adecuadamente.
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OficiosYa API funcionando correctamente',
  });
});

// Registro de enrutadores por dominio de negocio
app.use('/api/auth', authRoutes);                         // Autenticación (registro, login, sesión)
app.use('/api/categories', categoriesRoutes);             // Categorías de oficios y servicios
app.use('/api/profiles', profilesRoutes);                 // Gestión de perfiles de usuario
app.use('/api/providers', providersRoutes);               // Perfiles de prestadores de servicios
app.use('/api/services', servicesRoutes);                 // Catálogo de servicios disponibles
app.use('/api/provider-services', providerServicesRoutes);// Asociación entre prestadores y servicios
app.use('/api/service-requests', serviceRequestsRoutes);  // Solicitudes de contratación de servicios

/**
 * Middleware centralizado de errores
 * Captura cualquier error producido en las rutas anteriores y devuelve una respuesta estructurada.
 */
app.use(errorMiddleware);

export default app;