import { supabase } from '../config/supabase.js';

/**
 * Middleware de Autorización basado en Roles (RBAC - Role-Based Access Control).
 * 
 * ¿Qué hace?
 * Es una función de orden superior (factory) que recibe los roles permitidos (ej. 'ADMIN', 'PROVIDER', 'CLIENT')
 * y retorna un middleware de Express que:
 * 1. Comprueba que el usuario esté previamente autenticado (`req.user`).
 * 2. Consulta los roles asignados a ese usuario en la tabla `user_roles`.
 * 3. Valida si el usuario posee al menos uno de los roles autorizados.
 * 4. Si tiene permiso, adjunta los roles a `req.user.roles` y da paso con `next()`.
 * 5. Si no tiene permiso, responde con un código HTTP 403 (Prohibido).
 * 
 * @param {...string} allowedRoles - Lista de nombres de roles con acceso al recurso.
 * @returns {Function} Middleware de Express.
 */
export function authorize(...allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
      }

      // Consultar los roles del usuario en la base de datos
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          roles (
            name
          )
        `)
        .eq('user_id', req.user.id);

      if (error) {
        return next(error);
      }

      // Mapear los roles a un array simple de strings
      const userRoles = data
        .filter((item) => item.roles)
        .map((item) => item.roles.name);

      // Comprobar si al menos uno de sus roles coincide con los roles requeridos
      const hasRole = allowedRoles.some(
        (role) => userRoles.includes(role)
      );

      if (!hasRole) {
        return res.status(403).json({
          success: false,
          message:
            'No tienes permisos para realizar esta operación',
        });
      }

      // Guardar los roles en el objeto req.user para su uso posterior en los controladores
      req.user.roles = userRoles;

      next();
    } catch (error) {
      next(error);
    }
  };
}