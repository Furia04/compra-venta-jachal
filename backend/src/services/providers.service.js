import {
  findProviderById,
  assignProviderRole,
  updateProviderProfile as updateRepo,
} from '../repositories/providers.repository.js';
import { AppError } from '../utils/AppError.js';

/**
 * Da de alta un perfil de usuario existente como prestador de servicios (Worker/Provider).
 * 
 * Lógica:
 * 1. Comprueba si el usuario ya tiene perfil de prestador (evita duplicados con error 409).
 * 2. Asigna el rol 'PROVIDER' en la tabla `user_roles`.
 * 3. Actualiza o inicializa los datos laborales adicionales en el repositorio.
 * 
 * @param {string} userId - UUID del usuario.
 * @param {Object} providerData - Datos laborales del prestador (bio, experiencia, etc.).
 * @throws {AppError} 409 si ya es prestador.
 * @returns {Promise<Object>} Perfil de prestador actualizado/creado.
 */
export async function registerAsProvider(userId, providerData) {
  const alreadyProvider = await findProviderById(userId);

  if (alreadyProvider) {
    throw new AppError('El usuario ya se encuentra registrado como prestador', 409);
  }

  // Asigna el rol PROVIDER en user_roles
  await assignProviderRole(userId);

  // Actualiza los datos de perfil asociados al oficio si se enviaron
  const profile = await updateRepo(userId, providerData);

  return profile;
}

/**
 * Obtiene la información pública o completa de un prestador de servicios.
 * @param {string} providerId - UUID del prestador.
 * @throws {AppError} 404 si el prestador no existe.
 * @returns {Promise<Object>} Perfil del prestador.
 */
export async function getProviderProfile(providerId) {
  const provider = await findProviderById(providerId);

  if (!provider) {
    throw new AppError('Prestador no encontrado', 404);
  }

  return provider;
}

/**
 * Actualiza la información laboral del prestador autenticado.
 * @param {string} userId - UUID del usuario/prestador.
 * @param {Object} updateData - Campos laborales a actualizar.
 * @throws {AppError} 404 si no existe el prestador.
 * @returns {Promise<Object>} Perfil actualizado.
 */
export async function updateProviderProfileService(userId, updateData) {
  const provider = await findProviderById(userId);

  if (!provider) {
    throw new AppError('Perfil de prestador no encontrado', 404);
  }

  return updateRepo(userId, updateData);
}