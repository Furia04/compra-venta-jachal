import { supabase } from '../config/supabase.js';

/**
 * Consulta todas las categorías en la base de datos Supabase.
 * @param {Object} [options] - Opciones de filtrado.
 * @param {boolean} [options.includeInactive=false] - Si es false, filtra solo `is_active = true`.
 * @returns {Promise<Array>} Lista de registros de categorías ordenados por nombre.
 */
export async function findAllCategories({
  includeInactive = false,
} = {}) {
  let query = supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Busca una categoría por su ID numérico.
 * @param {number|string} id - Identificador de la categoría.
 * @returns {Promise<Object|null>} Objeto de la categoría o null si no existe.
 */
export async function findCategoryById(id) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Busca una categoría por su nombre (búsqueda insensible a mayúsculas/minúsculas).
 * @param {string} name - Nombre de la categoría.
 * @returns {Promise<Object|null>} Objeto de la categoría o null si no existe.
 */
export async function findCategoryByName(name) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .ilike('name', name)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Inserta una nueva categoría en la tabla `categories`.
 * @param {Object} params - Datos de la categoría.
 * @param {string} params.name - Nombre de la categoría.
 * @param {string} [params.description] - Descripción.
 * @returns {Promise<Object>} Registro creado.
 */
export async function createCategory({
  name,
  description,
}) {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name,
      description: description ?? null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Actualiza los campos especificados de una categoría en la base de datos.
 * @param {number|string} id - Identificador de la categoría.
 * @param {Object} fields - Campos a modificar.
 * @returns {Promise<Object>} Registro actualizado.
 */
export async function updateCategory(
  id,
  {
    name,
    description,
    isActive,
  }
) {
  const updates = {};

  if (name !== undefined) {
    updates.name = name;
  }

  if (description !== undefined) {
    updates.description = description;
  }

  if (isActive !== undefined) {
    updates.is_active = isActive;
  }

  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}