import { createClient } from '@supabase/supabase-js';
import env from './env.js';

/**
 * Instancia del cliente de Supabase utilizada para interactuar con la base de datos PostgreSQL,
 * autenticación y almacenamiento en la nube.
 */
export const supabase = createClient(
  env.supabaseUrl,
  env.supabaseAnonKey
);