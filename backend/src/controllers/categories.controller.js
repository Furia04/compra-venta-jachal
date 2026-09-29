import {
  getCategories,
  getCategoryById,
  createNewCategory,
  updateExistingCategory,
  deactivateCategory,
} from '../services/categories.service.js';

/**
 * Controlador para listar todas las categorías disponibles.
 * 
 * Flujo:
 * 1. Verifica si el usuario autenticado tiene rol 'ADMIN' para determinar si se deben
 *    incluir categorías inactivas o solo las activas (públicas).
 * 2. Invoca el servicio `getCategories`.
 * 3. Retorna HTTP 200 con la lista de categorías.
 */
export async function getCategoriesController(req, res, next) {
  try {
    const includeInactive = req.user?.roles?.includes('ADMIN') === true;

    const categories = await getCategories({
      includeInactive,
    });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para obtener el detalle de una categoría por su ID.
 * 
 * Flujo:
 * 1. Extrae `req.params.id`.
 * 2. Llama a `getCategoryById` para buscar la categoría en la BD.
 * 3. Retorna HTTP 200 con el objeto de la categoría o lanza error 404 si no existe.
 */
export async function getCategoryByIdController(req, res, next) {
  try {
    const category = await getCategoryById(req.params.id);

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para crear una nueva categoría (exclusivo para Administradores).
 * 
 * Flujo:
 * 1. Recibe los datos validados del cuerpo (`name`, `description`, etc.) en `req.body`.
 * 2. Llama al servicio `createNewCategory` que valida duplicados e inserta el registro.
 * 3. Retorna HTTP 201 (Created) con la nueva categoría creada.
 */
export async function createCategoryController(req, res, next) {
  try {
    const category = await createNewCategory(req.body);

    return res.status(201).json({
      success: true,
      message: 'Categoría creada correctamente',
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para actualizar una categoría existente por su ID (exclusivo para Administradores).
 * 
 * Flujo:
 * 1. Toma el `id` de los parámetros de ruta y los campos a modificar de `req.body`.
 * 2. Ejecuta `updateExistingCategory` para aplicar los cambios en la base de datos.
 * 3. Retorna HTTP 200 con el registro actualizado.
 */
export async function updateCategoryController(req, res, next) {
  try {
    const category = await updateExistingCategory(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: 'Categoría actualizada correctamente',
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para dar de baja lógica (soft delete) a una categoría.
 * 
 * Flujo:
 * 1. Recibe el `id` de la categoría a desactivar.
 * 2. Llama a `deactivateCategory` que cambia `is_active = false`.
 * 3. Retorna HTTP 200 con la confirmación de la desactivación.
 */
export async function deactivateCategoryController(req, res, next) {
  try {
    const category = await deactivateCategory(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Categoría desactivada correctamente',
      data: category,
    });
  } catch (error) {
    next(error);
  }
}