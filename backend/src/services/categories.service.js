import {
  findAllCategories,
  findCategoryById,
  findCategoryByName,
  createCategory,
  updateCategory,
} from '../repositories/categories.repository.js';

import { AppError } from '../utils/AppError.js';

/**
 * Obtiene la lista de categorías.
 * @param {Object} [options] - Opciones de filtrado.
 * @param {boolean} [options.includeInactive=false] - Indica si se deben incluir categorías desactivadas.
 * @returns {Promise<Array>} Lista de categorías.
 */
export async function getCategories({
  includeInactive = false,
} = {}) {
  return findAllCategories({
    includeInactive,
  });
}

/**
 * Obtiene una categoría específica a través de su identificador.
 * @param {number|string} id - Identificador de la categoría.
 * @throws {AppError} 404 si la categoría no existe.
 * @returns {Promise<Object>} Datos de la categoría.
 */
export async function getCategoryById(id) {
  const category = await findCategoryById(id);

  if (!category) {
    throw new AppError(
      'Categoría no encontrada',
      404
    );
  }

  return category;
}

/**
 * Registra una nueva categoría validando que no exista duplicado de nombre.
 * @param {Object} params - Datos de la categoría.
 * @param {string} params.name - Nombre único de la categoría.
 * @param {string} [params.description] - Descripción opcional.
 * @throws {AppError} 409 si el nombre ya existe.
 * @returns {Promise<Object>} Registro creado.
 */
export async function createNewCategory({
  name,
  description,
}) {
  const existingCategory =
    await findCategoryByName(name);

  if (existingCategory) {
    throw new AppError(
      'Ya existe una categoría con ese nombre',
      409
    );
  }

  return createCategory({
    name,
    description,
  });
}

/**
 * Actualiza los campos de una categoría existente.
 * Valida que la categoría exista y que el nuevo nombre (si se cambia) no colisione con otra.
 * @param {number|string} id - Identificador de la categoría.
 * @param {Object} updateData - Campos a modificar (name, description, isActive).
 * @throws {AppError} 404 si no existe, 409 si el nombre está duplicado.
 * @returns {Promise<Object>} Categoría actualizada.
 */
export async function updateExistingCategory(
  id,
  {
    name,
    description,
    isActive,
  }
) {
  const category = await findCategoryById(id);

  if (!category) {
    throw new AppError(
      'Categoría no encontrada',
      404
    );
  }

  if (name !== undefined) {
    const existingCategory =
      await findCategoryByName(name);

    if (
      existingCategory &&
      existingCategory.id !== Number(id)
    ) {
      throw new AppError(
        'Ya existe una categoría con ese nombre',
        409
      );
    }
  }

  return updateCategory(id, {
    name,
    description,
    isActive,
  });
}

/**
 * Da de baja lógica a una categoría (soft delete).
 * @param {number|string} id - Identificador de la categoría.
 * @throws {AppError} 404 si no existe, 409 si ya estaba inactiva.
 * @returns {Promise<Object>} Categoría desactivada.
 */
export async function deactivateCategory(id) {
  const category = await findCategoryById(id);

  if (!category) {
    throw new AppError(
      'Categoría no encontrada',
      404
    );
  }

  if (!category.is_active) {
    throw new AppError(
      'La categoría ya está inactiva',
      409
    );
  }

  return updateCategory(id, {
    isActive: false,
  });
}