import { supabase } from '../config/supabase.js';

/**
 * Obtiene el listado de servicios de la base de datos con su categoría anidada.
 * @param {Object} [options] - Filtros de búsqueda.
 * @param {number} [options.categoryId] - Filtrar por categoría.
 * @param {boolean} [options.includeInactive=false] - Incluir servicios dados de baja.
 * @returns {Promise<Array>} Lista de servicios.
 */
export async function findAllServices({ categoryId, includeInactive = false } = {}) {
  let query = supabase
    .from('services')
    .select(`
      id,
      category_id,
      name,
      description,
      is_active,
      created_at,
      updated_at,
      categories (
        id,
        name
      )
    `)
    .order('name', { ascending: true });

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  if (categoryId !== undefined) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Busca un servicio específico por su identificador único junto con su categoría.
 * @param {number|string} id - Identificador del servicio.
 * @returns {Promise<Object|null>} Servicio encontrado o null.
 */
export async function findServiceById(id) {
  const { data, error } = await supabase
    .from('services')
    .select(`
      id,
      category_id,
      name,
      description,
      is_active,
      created_at,
      updated_at,
      categories (
        id,
        name
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Busca si existe un servicio con el mismo nombre dentro de una misma categoría.
 * @param {number|string} categoryId - ID de la categoría.
 * @param {string} name - Nombre del servicio.
 * @returns {Promise<Object|null>} Servicio existente o null.
 */
export async function findServiceByCategoryAndName(categoryId, name) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('category_id', categoryId)
    .ilike('name', name)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Inserta un nuevo servicio en la base de datos.
 * @param {Object} params - Datos del nuevo servicio.
 * @param {number} params.categoryId - ID de la categoría padre.
 * @param {string} params.name - Nombre del servicio.
 * @param {string} [params.description] - Descripción.
 * @returns {Promise<Object>} Registro del servicio creado.
 */
export async function createServiceRecord({ categoryId, name, description }) {
  const { data, error } = await supabase
    .from('services')
    .insert({
      category_id: categoryId,
      name,
      description: description ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Actualiza los datos de un servicio en la tabla `services`.
 * @param {number|string} id - ID del servicio.
 * @param {Object} fields - Campos modificables (name, description, isActive).
 * @returns {Promise<Object>} Servicio actualizado.
 */
export async function updateServiceRecord(id, { name, description, isActive }) {
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (isActive !== undefined) updates.is_active = isActive;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}