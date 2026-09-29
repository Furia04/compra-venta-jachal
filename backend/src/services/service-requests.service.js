import {
  createServiceRequestRecord,
  findServiceRequestById,
  findServiceRequestsByUser,
  updateServiceRequestStatusRecord,
} from '../repositories/service-requests.repository.js';
import { findProviderById } from '../repositories/providers.repository.js';
import { findServiceById } from '../repositories/services.repository.js';
import { AppError } from '../utils/AppError.js';

/**
 * Registra una nueva solicitud de servicio de un cliente hacia un prestador.
 * 
 * Reglas de negocio:
 * 1. Un usuario no puede auto-contratarse (clientId === providerId -> 400).
 * 2. El prestador destino debe existir y tener perfil habilitado.
 * 3. El servicio solicitado debe existir y estar activo.
 * 
 * @param {string} clientId - UUID del cliente solicitante.
 * @param {Object} requestData - Datos de la solicitud.
 * @param {string} requestData.providerId - UUID del prestador contratado.
 * @param {number} requestData.serviceId - ID del servicio contratado.
 * @param {string} requestData.description - Detalle del trabajo o necesidad.
 * @param {string} [requestData.address] - Dirección del servicio.
 * @param {string} [requestData.urgency] - Nivel de urgencia (ej. 'LOW', 'MEDIUM', 'HIGH').
 * @returns {Promise<Object>} Solicitud de servicio creada.
 */
export async function createServiceRequest(clientId, requestData) {
  const { providerId, serviceId } = requestData;

  if (clientId === providerId) {
    throw new AppError('No puedes crear una solicitud de servicio hacia ti mismo', 400);
  }

  const provider = await findProviderById(providerId);
  if (!provider) {
    throw new AppError('El prestador especificado no existe o no tiene perfil habilitado', 404);
  }

  const service = await findServiceById(serviceId);
  if (!service || !service.is_active) {
    throw new AppError('El servicio especificado no existe o está inactivo', 404);
  }

  return createServiceRequestRecord({ clientId, ...requestData });
}

/**
 * Obtiene el detalle de una solicitud de servicio por ID.
 * Control de acceso: Solo pueden visualizarla el cliente que la creó, el prestador asignado o un ADMIN.
 * 
 * @param {number|string} id - ID de la solicitud.
 * @param {string} userId - UUID del usuario solicitante.
 * @param {Array<string>} [userRoles=[]] - Roles del usuario.
 * @throws {AppError} 404 no encontrada, 403 sin autorización.
 * @returns {Promise<Object>} Detalle de la solicitud con relaciones.
 */
export async function getServiceRequestById(id, userId, userRoles = []) {
  const request = await findServiceRequestById(id);
  if (!request) {
    throw new AppError('Solicitud de servicio no encontrada', 404);
  }

  const isAdmin = userRoles.includes('ADMIN');
  const isParticipant = request.client_id === userId || request.provider_id === userId;

  if (!isParticipant && !isAdmin) {
    throw new AppError('No tienes permisos para visualizar esta solicitud', 403);
  }

  return request;
}

/**
 * Consulta las solicitudes vinculadas al usuario, ya sea en rol de CLIENTE o PRESTADOR.
 * @param {string} userId - UUID del usuario.
 * @param {Object} [options] - Parámetros de consulta.
 * @param {string} [options.role='CLIENT'] - 'CLIENT' o 'PROVIDER'.
 * @returns {Promise<Array>} Lista de solicitudes.
 */
export async function getMyServiceRequests(userId, { role = 'CLIENT' } = {}) {
  return findServiceRequestsByUser(userId, { role });
}

/**
 * Gestiona la máquina de estados de una solicitud de servicio (ej. PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED).
 * 
 * Reglas de transición y roles:
 * - Solo participantes (cliente o prestador) o ADMIN pueden cambiar el estado.
 * - El cliente solo tiene permitido CANCELAR si la solicitud aún está PENDING.
 * - El prestador debe RECHAZAR en lugar de cancelar.
 * 
 * @param {number|string} id - ID de la solicitud.
 * @param {string} userId - UUID del usuario que ejecuta el cambio.
 * @param {Array<string>} [userRoles=[]] - Roles del usuario.
 * @param {string} newStatus - Nuevo estado deseado.
 * @throws {AppError} 404 no encontrada, 403 sin permisos, 400/409 transición inválida.
 * @returns {Promise<Object>} Solicitud con el estado actualizado.
 */
export async function updateServiceRequestStatus(id, userId, userRoles = [], newStatus) {
  const request = await findServiceRequestById(id);
  if (!request) {
    throw new AppError('Solicitud de servicio no encontrada', 404);
  }

  const isAdmin = userRoles.includes('ADMIN');
  const isClient = request.client_id === userId;
  const isProvider = request.provider_id === userId;

  if (!isClient && !isProvider && !isAdmin) {
    throw new AppError('No tienes permisos para modificar el estado de esta solicitud', 403);
  }

  // Regla: el cliente solo puede cancelar si aún está PENDING
  if (isClient && !isProvider && !isAdmin) {
    if (newStatus !== 'CANCELLED') {
      throw new AppError('El cliente solo puede cancelar una solicitud', 400);
    }
    if (request.status !== 'PENDING') {
      throw new AppError('Solo se pueden cancelar solicitudes en estado PENDING', 409);
    }
  }

  // Regla: el prestador puede aceptar, rechazar, avanzar o completar
  if (isProvider && !isAdmin) {
    if (newStatus === 'CANCELLED') {
      throw new AppError('El prestador debe RECHAZAR la solicitud en lugar de cancelarla', 400);
    }
  }

  return updateServiceRequestStatusRecord(id, newStatus);
}