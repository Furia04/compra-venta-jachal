import { Router } from 'express';

import {
  getCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deactivateCategoryController,
} from '../controllers/categories.controller.js';

import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { optionalAuthenticate } from '../middlewares/optional-auth.middleware.js';

import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/categories.validator.js';

const router = Router();

/**
 * @route GET /api/categories
 * @desc  Lista todas las categorías activas (o todas si quien consulta es ADMIN)
 * @access Público con detección de rol opcional
 */
router.get(
  '/',
  optionalAuthenticate,
  getCategoriesController
);

/**
 * @route GET /api/categories/:id
 * @desc  Obtiene el detalle de una categoría por su ID
 * @access Público
 */
router.get(
  '/:id',
  getCategoryByIdController
);

/**
 * @route POST /api/categories
 * @desc  Crea una nueva categoría
 * @access Privado (solo rol ADMIN)
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createCategorySchema),
  createCategoryController
);

/**
 * @route PATCH /api/categories/:id
 * @desc  Actualiza datos de una categoría
 * @access Privado (solo rol ADMIN)
 */
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateCategorySchema),
  updateCategoryController
);

/**
 * @route DELETE /api/categories/:id
 * @desc  Desactiva una categoría (baja lógica / soft delete)
 * @access Privado (solo rol ADMIN)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  deactivateCategoryController
);

export default router;