import { Router } from 'express';
import {
  registerProviderController,
  getProviderProfileController,
  updateProviderProfileController,
} from '../controllers/providers.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  registerProviderSchema,
  updateProviderProfileSchema,
} from '../validators/providers.validator.js';

const router = Router();

/**
 * @route POST /api/providers/register
 * @desc  Registra al usuario autenticado como prestador (Worker/Provider)
 * @access Privado (cualquier usuario registrado)
 */
router.post('/register', authenticate, validate(registerProviderSchema), registerProviderController);

/**
 * @route GET /api/providers/me
 * @desc  Obtiene el perfil laboral del prestador autenticado
 * @access Privado
 */
router.get('/me', authenticate, getProviderProfileController);

/**
 * @route PATCH /api/providers/me
 * @desc  Actualiza datos del perfil laboral del prestador autenticado
 * @access Privado
 */
router.patch('/me', authenticate, validate(updateProviderProfileSchema), updateProviderProfileController);

/**
 * @route GET /api/providers/:id
 * @desc  Consulta el perfil público de cualquier prestador por su UUID
 * @access Público
 */
router.get('/:id', getProviderProfileController);

export default router;