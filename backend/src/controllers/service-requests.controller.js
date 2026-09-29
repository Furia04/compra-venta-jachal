import {
  createServiceRequest,
  getServiceRequestById,
  getMyServiceRequests,
  updateServiceRequestStatus,
} from '../services/service-requests.service.js';

/**
 * Controlador para crear una nueva solicitud de contratación de servicio (Service Request).
 * 
 * Flujo:
 * 1. Toma el `req.user.id` del cliente que solicita y los datos en `req.body`
 *    (`provider_service_id`, `description`, `address`, `urgency`, `scheduled_at`, etc.).
 * 2. Llama al servicio `createServiceRequest`.
 * 3. Retorna HTTP 201 (Created) con la solicitud registrada en estado inicial (ej. 'PENDING').
 */
export async function createServiceRequestController(req, res, next) {
  try {
    const request = await createServiceRequest(req.user.id, req.body);
    return res.status(201).json({
      success: true,
      message: 'Solicitud de servicio creada correctamente',
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para consultar el detalle de una solicitud de servicio por su ID.
 * 
 * Flujo:
 * 1. Toma el `id` de `req.params.id`.
 * 2. Llama a `getServiceRequestById` pasando el ID del usuario y sus roles para
 *    garantizar que solo el cliente solicitante, el prestador contratado o un ADMIN puedan verla.
 * 3. Retorna HTTP 200 con la solicitud y sus relaciones.
 */
export async function getServiceRequestByIdController(req, res, next) {
  try {
    const request = await getServiceRequestById(req.params.id, req.user.id, req.user.roles);
    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para listar el historial de solicitudes del usuario autenticado.
 * 
 * Flujo:
 * 1. Verifica si el usuario desea ver sus solicitudes como CLIENTE (las que él contrató)
 *    o como PRESTADOR (las que otros le solicitaron a él), según `?role=PROVIDER` o `?role=CLIENT`.
 * 2. Llama a `getMyServiceRequests`.
 * 3. Retorna HTTP 200 con el listado de solicitudes.
 */
export async function getMyServiceRequestsController(req, res, next) {
  try {
    const role = req.query.role === 'PROVIDER' ? 'PROVIDER' : 'CLIENT';
    const requests = await getMyServiceRequests(req.user.id, { role });
    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para cambiar el estado de una solicitud de servicio (ej. ACEPTAR, RECHAZAR, COMPLETAR, CANCELAR).
 * 
 * Flujo:
 * 1. Recibe el ID de la solicitud y el nuevo `status` en `req.body`.
 * 2. Invoca a `updateServiceRequestStatus` que valida las reglas de transición de estados y permisos.
 * 3. Retorna HTTP 200 con la solicitud actualizada.
 */
export async function updateServiceRequestStatusController(req, res, next) {
  try {
    const updated = await updateServiceRequestStatus(
      req.params.id,
      req.user.id,
      req.user.roles,
      req.body.status
    );
    return res.status(200).json({
      success: true,
      message: 'Estado de la solicitud actualizado correctamente',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}