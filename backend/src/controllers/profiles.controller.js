import { getMyProfile, updateMyProfile } from '../services/profiles.service.js';

/**
 * Controlador para consultar el perfil personal del usuario autenticado.
 * 
 * Flujo:
 * 1. Obtiene el ID del usuario desde `req.user.id` (inyectado por el middleware de autenticación).
 * 2. Invoca el servicio `getMyProfile`.
 * 3. Retorna HTTP 200 con la información del perfil y sus roles.
 */
export async function getMyProfileController(req, res, next) {
  try {
    const profile = await getMyProfile(req.user.id);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para modificar los datos personales del perfil del usuario autenticado.
 * 
 * Flujo:
 * 1. Recibe el ID de `req.user.id` y los campos editables (`first_name`, `last_name`, `phone`, `avatar_url`) en `req.body`.
 * 2. Invoca `updateMyProfile` para persistir los cambios en la base de datos.
 * 3. Retorna HTTP 200 con el perfil actualizado.
 */
export async function updateMyProfileController(req, res, next) {
  try {
    const profile = await updateMyProfile(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Perfil actualizado correctamente',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}