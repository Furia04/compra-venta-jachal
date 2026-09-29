import { supabase } from '../config/supabase.js';

/**
 * Busca el registro de perfil asociado a un usuario por su UUID.
 * @param {string} userId - UUID del usuario.
 * @returns {Promise<Object|null>} Objeto de perfil o null si no se encuentra.
 */
export async function findProfileById(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Actualiza los campos de un perfil de usuario en la tabla `profiles`.
 * @param {string} userId - UUID del usuario.
 * @param {Object} fields - Campos modificables.
 * @returns {Promise<Object>} Perfil actualizado.
 */
export async function updateProfile(userId, { firstName, lastName, phone, profileImageUrl, description, city, department }) {
  const updates = {};

  if (firstName !== undefined) updates.first_name = firstName;
  if (lastName !== undefined) updates.last_name = lastName;
  if (phone !== undefined) updates.phone = phone;
  if (profileImageUrl !== undefined) updates.profile_image_url = profileImageUrl;
  if (description !== undefined) updates.description = description;
  if (city !== undefined) updates.city = city;
  if (department !== undefined) updates.department = department;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}