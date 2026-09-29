import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';

/**
 * Servicio de registro de nuevos usuarios en el sistema.
 * 
 * Lógica de negocio:
 * 1. Invoca `supabase.auth.signUp` con email y password.
 * 2. Si el email ya está en uso, detecta el conflicto y lanza `AppError(409)`.
 * 3. Crea el registro correspondiente en la tabla `profiles` vinculando el `user.id`.
 * 4. Obtiene el rol base 'CLIENT' desde la tabla `roles`.
 * 5. Asigna dicho rol al usuario en la tabla intermedia `user_roles`.
 * 6. Retorna el objeto del usuario creado y su sesión JWT inicial.
 * 
 * @param {Object} params - Datos del nuevo usuario.
 * @param {string} params.email - Correo electrónico del usuario.
 * @param {string} params.password - Contraseña en texto plano (Supabase se encarga del hash seguro).
 * @param {string} params.firstName - Nombre del usuario.
 * @param {string} params.lastName - Apellido del usuario.
 * @param {string} [params.phone] - Teléfono opcional de contacto.
 * @returns {Promise<{user: Object, session: Object}>} Objeto con el usuario y sesión.
 */
export async function registerUser({
  email,
  password,
  firstName,
  lastName,
  phone,
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (
      error.message.toLowerCase().includes('already registered')
    ) {
      throw new AppError(
        'El email ya está registrado',
        409
      );
    }

    throw error;
  }

  const user = data.user;

  if (!user) {
    throw new AppError(
      'No se pudo crear el usuario',
      500
    );
  }

  // Creación del perfil público asociado al ID de Auth
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      phone: phone ?? null,
    });

  if (profileError) {
    throw profileError;
  }

  // Buscar el rol 'CLIENT' para asignarlo por defecto
  const { data: clientRole, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'CLIENT')
    .single();

  if (roleError) {
    throw roleError;
  }

  // Vinculación en la tabla user_roles
  const { error: userRoleError } = await supabase
    .from('user_roles')
    .insert({
      user_id: user.id,
      role_id: clientRole.id,
    });

  if (userRoleError) {
    throw userRoleError;
  }

  return {
    user,
    session: data.session,
  };
}

/**
 * Servicio para autenticar un usuario existente mediante email y contraseña.
 * 
 * Lógica de negocio:
 * 1. Envía credenciales a `supabase.auth.signInWithPassword`.
 * 2. Si las credenciales son incorrectas, lanza `AppError(401)`.
 * 3. Retorna los datos del usuario autenticado junto al token JWT de sesión.
 * 
 * @param {Object} credentials - Credenciales de acceso.
 * @param {string} credentials.email - Correo registrado.
 * @param {string} credentials.password - Contraseña.
 * @returns {Promise<{user: Object, session: Object}>} Datos del usuario y token.
 */
export async function loginUser({
  email,
  password,
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('SUPABASE LOGIN ERROR:', error);
  
    throw new AppError(
      error.message,
      401
    );
  }

  if (!data.user || !data.session) {
    throw new AppError(
      'No se pudo iniciar sesión',
      401
    );
  }

  return {
    user: data.user,
    session: data.session,
  };
}