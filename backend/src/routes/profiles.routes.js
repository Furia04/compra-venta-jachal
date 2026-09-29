import { Router } from 'express';
import {
  getMyProfileController,
  updateMyProfileController,
} from '../controllers/profiles.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateProfileSchema } from '../validators/profiles.validator.js';

const router = Router();

/**
 * @route GET /api/profiles/me
 * @desc  Obtiene los datos del perfil del usuario autenticado
 * @access Privado (requiere autenticación)
 */
router.get('/me', authenticate, getMyProfileController);

/**
 * @route PATCH /api/profiles/me
 * @desc  Actualiza datos personales del perfil del usuario autenticado
 * @access Privado (requiere autenticación y datos validados)
 */
router.patch('/me', authenticate, validate(updateProfileSchema), updateMyProfileController);

export default router;