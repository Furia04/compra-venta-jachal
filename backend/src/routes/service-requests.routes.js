import { Router } from 'express';
import {
  createServiceRequestController,
  getServiceRequestByIdController,
  getMyServiceRequestsController,
  updateServiceRequestStatusController,
} from '../controllers/service-requests.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createServiceRequestSchema,
  updateServiceRequestStatusSchema,
} from '../validators/service-requests.validator.js';

const router = Router();

/**
 * @route POST /api/service-requests
 * @desc  Crea una nueva solicitud de contratación de servicio (Cliente -> Prestador)
 * @access Privado (requiere autenticación)
 */
router.post(
  '/',
  authenticate,
  validate(createServiceRequestSchema),
  createServiceRequestController
);

/**
 * @route GET /api/service-requests/me
 * @desc  Lista solicitudes del usuario logueado (?role=CLIENT o ?role=PROVIDER)
 * @access Privado
 */
router.get('/me', authenticate, getMyServiceRequestsController);

/**
 * @route GET /api/service-requests/:id
 * @desc  Obtiene el detalle de una solicitud de servicio específica
 * @access Privado (solo cliente solicitante, prestador asignado o ADMIN)
 */
router.get('/:id', authenticate, getServiceRequestByIdController);

/**
 * @route PATCH /api/service-requests/:id/status
 * @desc  Actualiza el estado de una solicitud (PENDING, ACCEPTED, REJECTED, etc.)
 * @access Privado (valida permisos de cliente o prestador)
 */
router.patch(
  '/:id/status',
  authenticate,
  validate(updateServiceRequestStatusSchema),
  updateServiceRequestStatusController
);

export default router;