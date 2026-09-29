import { supabase } from '../config/supabase.js';

/**
 * Inserta una nueva solicitud de servicio en la tabla `service_requests`.
 * @param {Object} params - Datos de la solicitud.
 * @param {string} params.clientId - UUID del cliente solicitante.
 * @param {string} params.providerId - UUID del prestador contratado.
 * @param {number} params.serviceId - ID del servicio contratado.
 * @param {string} params.title - Título o asunto de la solicitud.
 * @param {string} params.description - Detalle del requerimiento.
 * @param {string} [params.address] - Dirección del trabajo.
 * @param {string} [params.city] - Ciudad / Localidad.
 * @param {string} [params.requestedDate] - Fecha acordada o preferida.
 * @returns {Promise<Object>} Registro creado con estado inicial 'PENDING'.
 */
export async function createServiceRequestRecord({
  clientId,
  providerId,
  serviceId,
  title,
  description,
  address,
  city,
  requestedDate,
}) {
  const { data, error } = await supabase
    .from('service_requests')
    .insert({
      client_id: clientId,
      provider_id: providerId,
      service_id: serviceId,
      title,
      description,
      address: address ?? null,
      city: city ?? null,
      requested_date: requestedDate ?? null,
      status: 'PENDING',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Busca una solicitud de servicio por su ID e incluye los datos del servicio relacionado.
 * @param {number|string} id - ID de la solicitud.
 * @returns {Promise<Object|null>} Solicitud de servicio o null.
 */
export async function findServiceRequestById(id) {
  const { data, error } = await supabase
    .from('service_requests')
    .select(`
      id,
      title,
      description,
      address,
      city,
      requested_date,
      status,
      created_at,
      updated_at,
      client_id,
      provider_id,
      service_id,
      services (
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
 * Busca todas las solicitudes vinculadas a un usuario según su rol (como solicitante o prestador).
 * @param {string} userId - UUID del usuario.
 * @param {Object} [options] - Opciones.
 * @param {string} [options.role='CLIENT'] - 'CLIENT' o 'PROVIDER'.
 * @returns {Promise<Array>} Lista de solicitudes ordenadas cronológicamente descendente.
 */
export async function findServiceRequestsByUser(userId, { role = 'CLIENT' } = {}) {
  let query = supabase
    .from('service_requests')
    .select(`
      id,
      title,
      description,
      address,
      city,
      requested_date,
      status,
      created_at,
      updated_at,
      client_id,
      provider_id,
      service_id,
      services (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (role === 'PROVIDER') {
    query = query.eq('provider_id', userId);
  } else {
    query = query.eq('client_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Actualiza el estado de una solicitud de servicio en la base de datos.
 * @param {number|string} id - ID de la solicitud.
 * @param {string} status - Nuevo estado (PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED).
 * @returns {Promise<Object>} Registro actualizado.
 */
export async function updateServiceRequestStatusRecord(id, status) {
  const { data, error } = await supabase
    .from('service_requests')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}