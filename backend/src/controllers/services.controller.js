import {
  getServices,
  getServiceById,
  createNewService,
  updateExistingService,
  deactivateService,
} from '../services/services.service.js';

/**
 * Controlador para listar el catálogo de servicios ofrecidos.
 * 
 * Flujo:
 * 1. Identifica si el usuario es ADMIN para incluir servicios dados de baja lógica.
 * 2. Permite filtrar por `categoryId` recibido por query param (`?categoryId=1`).
 * 3. Llama a `getServices` y retorna HTTP 200 con la lista de servicios.
 */
export async function getServicesController(req, res, next) {
  try {
    const includeInactive = req.user?.roles?.includes('ADMIN') === true;
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;

    const services = await getServices({ categoryId, includeInactive });
    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para obtener el detalle de un servicio específico por su ID.
 * 
 * Flujo:
 * 1. Extrae `req.params.id`.
 * 2. Llama a `getServiceById`.
 * 3. Retorna HTTP 200 con el servicio encontrado.
 */
export async function getServiceByIdController(req, res, next) {
  try {
    const service = await getServiceById(req.params.id);
    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para dar de alta un nuevo servicio en el catálogo (exclusivo ADMIN).
 * 
 * Flujo:
 * 1. Recibe los datos validados del servicio (`name`, `category_id`, `description`) en `req.body`.
 * 2. Llama a `createNewService`.
 * 3. Retorna HTTP 201 (Created) con el nuevo servicio creado.
 */
export async function createServiceController(req, res, next) {
  try {
    const service = await createNewService(req.body);
    return res.status(201).json({
      success: true,
      message: 'Servicio creado correctamente',
      data: service,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para actualizar un servicio del catálogo (exclusivo ADMIN).
 * 
 * Flujo:
 * 1. Extrae el `id` del parámetro de ruta y los campos a modificar de `req.body`.
 * 2. Ejecuta `updateExistingService`.
 * 3. Retorna HTTP 200 con el servicio actualizado.
 */
export async function updateServiceController(req, res, next) {
  try {
    const service = await updateExistingService(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Servicio actualizado correctamente',
      data: service,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para desactivar (soft delete) un servicio del catálogo (exclusivo ADMIN).
 * 
 * Flujo:
 * 1. Extrae `req.params.id`.
 * 2. Ejecuta `deactivateService` para establecer `is_active = false`.
 * 3. Retorna HTTP 200 confirmando la desactivación.
 */
export async function deactivateServiceController(req, res, next) {
  try {
    const service = await deactivateService(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Servicio desactivado correctamente',
      data: service,
    });
  } catch (error) {
    next(error);
  }
}