import 'dotenv/config';

/**
 * Objeto de configuración centralizada de variables de entorno.
 * Permite acceder a las claves y parámetros del sistema con valores por defecto para desarrollo.
 */
const env = {
  // Puerto en el que se levantará el servidor Express
  port: process.env.PORT || 3000,

  // URL del proyecto en Supabase (Backend as a Service)
  supabaseUrl: process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co',

  // Clave pública/anónima de Supabase para operaciones de cliente
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key',

  // Clave con permisos de administración (service role) para tareas privilegiadas
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key',

  // Origen permitido para solicitudes CORS (ej. http://localhost:5173 o dominio en producción)
  corsOrigin: process.env.CORS_ORIGIN || '*'
};

export default env;