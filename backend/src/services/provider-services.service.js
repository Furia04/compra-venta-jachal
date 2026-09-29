import {
  findServicesByProviderId,
  findProviderServiceById,
  findProviderServiceRelation,
  createProviderServiceRecord,
  updateProviderServiceRecord,
} from '../repositories/provider-services.repository.js';
import { findServiceById } from '../repositories/services.repository.js';
import { findProviderById } from '../repositories/providers.repository.js';
import { AppError } from '../utils/AppError.js';

/**
 * Obtiene todos los servicios ofrecidos por un prestador de servicios específico.
 * @param {string} providerId - UUID del prestador.
 * @param {Object} [options] - Opciones de filtrado.
 * @param {boolean} [options.includeInactive=false] - Incluir servicios deshabilitados.
 * @throws {AppError} 404 si el prestador no existe.
 * @returns {Promise<Array>} Lista de servicios del prestador.
 */
export async function getProviderServices(providerId, { includeInactive = false } = {}) {
  const provider = await findProviderById(providerId);
  if (!provider) {
    throw new AppError('Prestador no encontrado', 404);
  }

  return findServicesByProviderId(providerId, { includeInactive });
}

/**
 * Vincula un servicio del catálogo al perfil de un prestador con sus tarifas y condiciones particulares.
 * 
 * Validaciones:
 * 1. El usuario debe tener perfil de prestador activo.
 * 2. El servicio base debe existir y estar activo.
 * 3. No debe existir ya una vinculación previa para ese servicio en este prestador.
 * 
 * @param {string} providerId - UUID del prestador.
 * @param {Object} data - Datos del servicio ofrecido.
 * @param {number} data.serviceId - ID del servicio base.
 * @param {number} [data.priceFrom] - Precio base o desde.
 * @param {number} [data.priceTo] - Precio hasta (rango).
 * @param {string} [data.description] - Descripción personalizada del prestador.
 * @returns {Promise<Object>} Registro creado.
 */
export async function addServiceToProvider(providerId, { serviceId, priceFrom, priceTo, description }) {
  const provider = await findProviderById(providerId);
  if (!provider) {
    throw new AppError('Debes estar registrado como prestador para ofrecer servicios', 403);
  }

  const service = await findServiceById(serviceId);
  if (!service || !service.is_active) {
    throw new AppError('El servicio especificado no existe o está inactivo', 404);
  }

  const existingRelation = await findProviderServiceRelation(providerId, serviceId);
  if (existingRelation) {
    throw new AppError('Ya tienes vinculado este servicio en tu perfil', 409);
  }

  return createProviderServiceRecord({ providerId, serviceId, priceFrom, priceTo, description });
}

/**
 * Actualiza la información o precios de un servicio ofrecido por un prestador.
 * Verifica permisos: solo el propio prestador o un ADMIN pueden editarlo.
 * 
 * @param {number|string} id - ID de la relación provider_service.
 * @param {string} userId - UUID del usuario que realiza la petición.
 * @param {Array<string>} userRoles - Roles del usuario.
 * @param {Object} updateData - Campos a modificar.
 * @throws {AppError} 404 si no existe, 403 si no tiene permisos.
 * @returns {Promise<Object>} Registro actualizado.
 */
export async function updateProviderService(id, userId, userRoles, updateData) {
  const record = await findProviderServiceById(id);
  if (!record) {
    throw new AppError('Servicio de prestador no encontrado', 404);
  }

  const isAdmin = userRoles?.includes('ADMIN');
  const isOwner = record.provider_id === userId;

  if (!isOwner && !isAdmin) {
    throw new AppError('No tienes permisos para modificar este servicio', 403);
  }

  return updateProviderServiceRecord(id, updateData);
}

/**
 * Da de baja lógica a un servicio ofrecido por un prestador (is_active = false).
 * Verifica permisos de autoría o administración.
 * 
 * @param {number|string} id - ID de la relación.
 * @param {string} userId - UUID del usuario solicitante.
 * @param {Array<string>} userRoles - Roles del usuario.
 * @throws {AppError} 404 no encontrado, 403 sin permisos, 409 ya inactivo.
 * @returns {Promise<Object>} Registro desactivado.
 */
export async function deactivateProviderService(id, userId, userRoles) {
  const record = await findProviderServiceById(id);
  if (!record) {
    throw new AppError('Servicio de prestador no encontrado', 404);
  }

  const isAdmin = userRoles?.includes('ADMIN');
  const isOwner = record.provider_id === userId;

  if (!isOwner && !isAdmin) {
    throw new AppError('No tienes permisos para desactivar este servicio', 403);
  }

  if (!record.is_active) {
    throw new AppError('El servicio ya se encuentra inactivo', 409);
  }

  return updateProviderServiceRecord(id, { isActive: false });
}