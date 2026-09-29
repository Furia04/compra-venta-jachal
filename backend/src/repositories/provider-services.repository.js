import { supabase } from '../config/supabase.js';

/**
 * Consulta los servicios vinculados a un prestador, incluyendo los datos del servicio y su categoría.
 * @param {string} providerId - UUID del prestador.
 * @param {Object} [options] - Opciones de filtrado.
 * @param {boolean} [options.includeInactive=false] - Incluir servicios dados de baja.
 * @returns {Promise<Array>} Lista de servicios del prestador.
 */
export async function findServicesByProviderId(providerId, { includeInactive = false } = {}) {
  let query = supabase
    .from('provider_services')
    .select(`
      id,
      provider_id,
      service_id,
      price_from,
      price_to,
      description,
      is_active,
      created_at,
      updated_at,
      services (
        id,
        name,
        description,
        category_id,
        categories (
          id,
          name
        )
      )
    `)
    .eq('provider_id', providerId);

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Busca un registro de provider_service por su ID único.
 * @param {number|string} id - ID del registro.
 * @returns {Promise<Object|null>} Registro encontrado o null.
 */
export async function findProviderServiceById(id) {
  const { data, error } = await supabase
    .from('provider_services')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Verifica si ya existe una vinculación activa o inactiva entre un prestador y un servicio determinado.
 * @param {string} providerId - UUID del prestador.
 * @param {number|string} serviceId - ID del servicio.
 * @returns {Promise<Object|null>} Relación existente o null.
 */
export async function findProviderServiceRelation(providerId, serviceId) {
  const { data, error } = await supabase
    .from('provider_services')
    .select('*')
    .eq('provider_id', providerId)
    .eq('service_id', serviceId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Inserta una nueva relación entre un prestador y un servicio en `provider_services`.
 * @param {Object} params - Datos de la relación.
 * @param {string} params.providerId - UUID del prestador.
 * @param {number} params.serviceId - ID del servicio.
 * @param {number} [params.priceFrom] - Precio desde.
 * @param {number} [params.priceTo] - Precio hasta.
 * @param {string} [params.description] - Descripción de la prestación.
 * @returns {Promise<Object>} Registro creado.
 */
export async function createProviderServiceRecord({ providerId, serviceId, priceFrom, priceTo, description }) {
  const { data, error } = await supabase
    .from('provider_services')
    .insert({
      provider_id: providerId,
      service_id: serviceId,
      price_from: priceFrom ?? null,
      price_to: priceTo ?? null,
      description: description ?? null,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Actualiza los campos de un servicio ofrecido por un prestador.
 * @param {number|string} id - ID del registro.
 * @param {Object} fields - Campos modificables (priceFrom, priceTo, description, isActive).
 * @returns {Promise<Object>} Registro actualizado.
 */
export async function updateProviderServiceRecord(id, { priceFrom, priceTo, description, isActive }) {
  const updates = {};
  if (priceFrom !== undefined) updates.price_from = priceFrom;
  if (priceTo !== undefined) updates.price_to = priceTo;
  if (description !== undefined) updates.description = description;
  if (isActive !== undefined) updates.is_active = isActive;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('provider_services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}