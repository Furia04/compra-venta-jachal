import 'dotenv/config';

const env = {
  port: process.env.PORT || 3000,

  supabaseUrl: process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};

export default env;