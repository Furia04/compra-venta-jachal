import { createClient } from '@supabase/supabase-js';
import env from '../config/env.js';

/**
 * Middleware de Autenticación Requerida.
 * 
 * ¿Qué hace?
 * 1. Extrae el token JWT enviado en el encabezado `Authorization: Bearer <token>`.
 * 2. Valida la existencia y el formato correcto del token.
 * 3. Consulta a Supabase Auth para verificar la validez y vigencia del token.
 * 4. Si es válido, inyecta la información del usuario autenticado en `req.user` y continúa (`next()`).
 * 5. Si no es válido o está ausente, corta el flujo devolviendo un error HTTP 401 (No Autorizado).
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Verificar si se incluyó la cabecera Authorization
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido',
      });
    }

    const [type, token] = authHeader.split(' ');

    // Verificar formato Bearer
    if (type !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de autorización inválido',
      });
    }

    // Crear cliente con el token del usuario para validar su sesión en Supabase
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

    // Obtener los datos del usuario asociado al token
    const {
      data: { user },
      error,
    } = await supabaseAuth.auth.getUser();

    // Si hubo error o no existe el usuario, el token es inválido o expiró
    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }

    // Adjuntar usuario autenticado a la solicitud (request)
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}