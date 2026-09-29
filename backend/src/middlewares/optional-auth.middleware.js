import { createClient } from '@supabase/supabase-js';
import env from '../config/env.js';
import { supabase } from '../config/supabase.js';

/**
 * Middleware de Autenticación Opcional.
 * 
 * ¿Qué hace?
 * Permite que rutas públicas (como ver listados de categorías o servicios) identifiquen
 * si quien consulta es un usuario autenticado (y qué rol tiene) sin bloquear la petición
 * en caso de que sea un visitante anónimo.
 * 
 * Casos de uso:
 * - Si viene un token válido: inyecta `req.user` y sus roles (`req.user.roles`) para que
 *   los controladores puedan por ejemplo mostrar elementos adicionales a administradores
 *   (como categorías inactivas).
 * - Si no viene token o es inválido: deja pasar la petición sin `req.user`, permitiendo
 *   la navegación pública regular.
 */
export async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Caso 1: No hay encabezado de autenticación -> continuar como usuario público
    if (!authHeader) {
      return next();
    }

    const [type, token] = authHeader.split(' ');

    // Caso 2: Formato inválido -> continuar como usuario público
    if (type !== 'Bearer' || !token) {
      return next();
    }

    // Instanciar cliente temporal con el token para verificar usuario
    const supabaseAuth = createClient(
      env.supabaseUrl,
      env.supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabaseAuth.auth.getUser();

    // Caso 3: Token inválido o expirado -> continuar como usuario público
    if (error || !user) {
      return next();
    }

    // Usuario autenticado reconocido
    req.user = user;

    // Obtener los roles del usuario desde la base de datos
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select(`
        roles (
          name
        )
      `)
      .eq('user_id', user.id);

    if (roleError) {
      return next(roleError);
    }

    const userRoles = roleData
      .filter((item) => item.roles)
      .map((item) => item.roles.name);

    req.user.roles = userRoles;

    next();
  } catch (error) {
    next(error);
  }
}
