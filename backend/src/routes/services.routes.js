import { Router } from 'express';
import {
  getServicesController,
  getServiceByIdController,
  createServiceController,
  updateServiceController,
  deactivateServiceController,
} from '../controllers/services.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { optionalAuthenticate } from '../middlewares/optional-auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createServiceSchema,
  updateServiceSchema,
} from '../validators/services.validator.js';

const router = Router();

/**
 * @route GET /api/services
 * @desc  Lista todos los servicios activos del catálogo (o todos si es ADMIN)
 * @access Público con detección de rol opcional
 */
router.get('/', optionalAuthenticate, getServicesController);

/**
 * @route GET /api/services/:id
 * @desc  Obtiene el detalle de un servicio por su ID
 * @access Público
 */
router.get('/:id', getServiceByIdController);

/**
 * @route POST /api/services
 * @desc  Crea un nuevo servicio en el catálogo
 * @access Privado (solo rol ADMIN)
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createServiceSchema),
  createServiceController
);

/**
 * @route PATCH /api/services/:id
 * @desc  Actualiza datos de un servicio
 * @access Privado (solo rol ADMIN)
 */
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateServiceSchema),
  updateServiceController
);

/**
 * @route DELETE /api/services/:id
 * @desc  Desactiva un servicio del catálogo (soft delete)
 * @access Privado (solo rol ADMIN)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  deactivateServiceController
);

export default router;