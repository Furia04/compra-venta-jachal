import { findProfileById, updateProfile } from '../repositories/profiles.repository.js';
import { AppError } from '../utils/AppError.js';

/**
 * Obtiene el perfil de un usuario junto a sus roles asociados.
 * @param {string} userId - UUID del usuario.
 * @throws {AppError} 404 si el perfil no existe.
 * @returns {Promise<Object>} Perfil del usuario.
 */
export async function getMyProfile(userId) {
  const profile = await findProfileById(userId);

  if (!profile) {
    throw new AppError('Perfil no encontrado', 404);
  }

  return profile;
}

/**
 * Actualiza los datos personales del perfil de un usuario.
 * @param {string} userId - UUID del usuario.
 * @param {Object} updateData - Campos modificables (first_name, last_name, phone, avatar_url).
 * @throws {AppError} 404 si el usuario no existe.
 * @returns {Promise<Object>} Perfil actualizado.
 */
export async function updateMyProfile(userId, updateData) {
  const profile = await findProfileById(userId);

  if (!profile) {
    throw new AppError('Perfil no encontrado', 404);
  }

  return updateProfile(userId, updateData);
}