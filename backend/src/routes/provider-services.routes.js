import { Router } from 'express';
import {
  getProviderServicesController,
  createProviderServiceController,
  updateProviderServiceController,
  deactivateProviderServiceController,
} from '../controllers/provider-services.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { optionalAuthenticate } from '../middlewares/optional-auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createProviderServiceSchema,
  updateProviderServiceSchema,
} from '../validators/provider-services.validator.js';

const router = Router();

/**
 * @route GET /api/provider-services/provider/:providerId
 * @desc  Lista todos los servicios vinculados a un prestador específico
 * @access Público (si es dueño o ADMIN ve también inactivos)
 */
router.get('/provider/:providerId', optionalAuthenticate, getProviderServicesController);

/**
 * @route POST /api/provider-services
 * @desc  Vincula un servicio del catálogo al prestador autenticado
 * @access Privado (requiere rol PROVIDER)
 */
router.post(
  '/',
  authenticate,
  authorize('PROVIDER'),
  validate(createProviderServiceSchema),
  createProviderServiceController
);

/**
 * @route PATCH /api/provider-services/:id
 * @desc  Modifica precios o descripción de un servicio propio
 * @access Privado (dueño del servicio o ADMIN)
 */
router.patch(
  '/:id',
  authenticate,
  validate(updateProviderServiceSchema),
  updateProviderServiceController
);

/**
 * @route DELETE /api/provider-services/:id
 * @desc  Desactiva un servicio vinculado del prestador
 * @access Privado (dueño del servicio o ADMIN)
 */
router.delete(
  '/:id',
  authenticate,
  deactivateProviderServiceController
);

export default router;