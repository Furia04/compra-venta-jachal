import {
  findAllServices,
  findServiceById,
  findServiceByCategoryAndName,
  createServiceRecord,
  updateServiceRecord,
} from '../repositories/services.repository.js';
import { findCategoryById } from '../repositories/categories.repository.js';
import { AppError } from '../utils/AppError.js';

/**
 * Consulta el catálogo de servicios con filtros opcionales.
 * @param {Object} [options] - Opciones de filtrado.
 * @param {number} [options.categoryId] - Filtrar por ID de categoría.
 * @param {boolean} [options.includeInactive=false] - Incluir servicios desactivados.
 * @returns {Promise<Array>} Lista de servicios.
 */
export async function getServices({ categoryId, includeInactive = false } = {}) {
  return findAllServices({ categoryId, includeInactive });
}

/**
 * Obtiene un servicio específico por su identificador.
 * @param {number|string} id - Identificador del servicio.
 * @throws {AppError} 404 si el servicio no existe.
 * @returns {Promise<Object>} Datos del servicio.
 */
export async function getServiceById(id) {
  const service = await findServiceById(id);
  if (!service) {
    throw new AppError('Servicio no encontrado', 404);
  }
  return service;
}

/**
 * Registra un nuevo servicio en el catálogo asociado a una categoría existente.
 * 
 * Lógica:
 * 1. Verifica que la categoría asociada exista (error 404 si no existe).
 * 2. Verifica que no exista otro servicio con el mismo nombre dentro de esa categoría (error 409).
 * 3. Persiste el nuevo servicio.
 * 
 * @param {Object} params - Datos del nuevo servicio.
 * @param {number} params.categoryId - ID de la categoría padre.
 * @param {string} params.name - Nombre del servicio.
 * @param {string} [params.description] - Descripción del servicio.
 * @returns {Promise<Object>} Registro del servicio creado.
 */
export async function createNewService({ categoryId, name, description }) {
  const category = await findCategoryById(categoryId);
  if (!category) {
    throw new AppError('La categoría asociada no existe', 404);
  }

  const existing = await findServiceByCategoryAndName(categoryId, name);
  if (existing) {
    throw new AppError('Ya existe un servicio con ese nombre en esta categoría', 409);
  }

  return createServiceRecord({ categoryId, name, description });
}

/**
 * Modifica los atributos de un servicio existente.
 * @param {number|string} id - ID del servicio.
 * @param {Object} updateData - Campos a modificar (name, description, isActive).
 * @throws {AppError} 404 si no existe, 409 si el nuevo nombre colisiona.
 * @returns {Promise<Object>} Servicio modificado.
 */
export async function updateExistingService(id, { name, description, isActive }) {
  const service = await findServiceById(id);
  if (!service) {
    throw new AppError('Servicio no encontrado', 404);
  }

  if (name !== undefined) {
    const existing = await findServiceByCategoryAndName(service.category_id, name);
    if (existing && existing.id !== Number(id)) {
      throw new AppError('Ya existe un servicio con ese nombre en esta categoría', 409);
    }
  }

  return updateServiceRecord(id, { name, description, isActive });
}

/**
 * Da de baja lógica a un servicio (is_active = false).
 * @param {number|string} id - ID del servicio.
 * @throws {AppError} 404 si no existe, 409 si ya está inactivo.
 * @returns {Promise<Object>} Servicio desactivado.
 */
export async function deactivateService(id) {
  const service = await findServiceById(id);
  if (!service) {
    throw new AppError('Servicio no encontrado', 404);
  }

  if (!service.is_active) {
    throw new AppError('El servicio ya está inactivo', 409);
  }

  return updateServiceRecord(id, { isActive: false });
}