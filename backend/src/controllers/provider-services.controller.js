import {
  getProviderServices,
  addServiceToProvider,
  updateProviderService,
  deactivateProviderService,
} from '../services/provider-services.service.js';

/**
 * Controlador para listar los servicios ofrecidos por un prestador específico.
 * 
 * Flujo:
 * 1. Verifica si el usuario solicitante es el dueño del perfil o un administrador para
 *    determinar si se devuelven también servicios inactivos.
 * 2. Llama a `getProviderServices` con el `providerId`.
 * 3. Retorna HTTP 200 con la lista de servicios asociados y sus tarifas/descripciones.
 */
export async function getProviderServicesController(req, res, next) {
  try {
    const isOwnerOrAdmin = req.user?.id === req.params.providerId || req.user?.roles?.includes('ADMIN');
    const services = await getProviderServices(req.params.providerId, { includeInactive: isOwnerOrAdmin });

    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para que un prestador asocie un nuevo servicio a su perfil profesional.
 * 
 * Flujo:
 * 1. Toma el `req.user.id` del prestador autenticado y los datos del servicio en `req.body`
 *    (`service_id`, `custom_description`, `price_hour`, `price_custom`, etc.).
 * 2. Llama a `addServiceToProvider`.
 * 3. Retorna HTTP 201 (Created) con el servicio vinculado.
 */
export async function createProviderServiceController(req, res, next) {
  try {
    const record = await addServiceToProvider(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: 'Servicio vinculado correctamente al prestador',
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para modificar las condiciones o precios de un servicio ofrecido por el prestador.
 * 
 * Flujo:
 * 1. Recibe el ID de la vinculación (`req.params.id`), el usuario actual y los campos a actualizar.
 * 2. Llama a `updateProviderService` (verifica propiedad o rol de administrador).
 * 3. Retorna HTTP 200 con la vinculación actualizada.
 */
export async function updateProviderServiceController(req, res, next) {
  try {
    const updated = await updateProviderService(req.params.id, req.user.id, req.user.roles, req.body);

    return res.status(200).json({
      success: true,
      message: 'Servicio del prestador actualizado correctamente',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para desactivar un servicio del catálogo personal de un prestador.
 * 
 * Flujo:
 * 1. Recibe el ID del registro en `req.params.id`.
 * 2. Llama a `deactivateProviderService` para deshabilitarlo lógicamente (`is_active = false`).
 * 3. Retorna HTTP 200 confirmando la baja.
 */
export async function deactivateProviderServiceController(req, res, next) {
  try {
    const deactivated = await deactivateProviderService(req.params.id, req.user.id, req.user.roles);

    return res.status(200).json({
      success: true,
      message: 'Servicio del prestador desactivado correctamente',
      data: deactivated,
    });
  } catch (error) {
    next(error);
  }
}