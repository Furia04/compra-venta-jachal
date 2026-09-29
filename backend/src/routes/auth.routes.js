import { Router } from 'express';

import {
  register,
  login,
  getMe,
} from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  registerSchema,
  loginSchema,
} from '../validators/auth.validator.js';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc  Registra un nuevo usuario cliente con perfil inicial
 * @access Público (valida estructura de datos con registerSchema)
 */
router.post(
  '/register',
  validate(registerSchema),
  register
);

/**
 * @route POST /api/auth/login
 * @desc  Inicia sesión y retorna token JWT
 * @access Público (valida estructura de datos con loginSchema)
 */
router.post(
  '/login',
  validate(loginSchema),
  login
);

/**
 * @route GET /api/auth/me
 * @desc  Retorna los datos del usuario en sesión
 * @access Privado (requiere token JWT válido)
 */
router.get(
  '/me',
  authenticate,
  getMe
);

export default router;