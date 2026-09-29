import { apiFetch } from './api'
import type { ApiResponse } from './api'
import type { Category } from '../types/Category'
import { mockCategories } from '../data/mockCategories'

/**
 * Obtiene el listado completo de categorías disponibles en la plataforma.
 * 
 * Estrategia de resiliencia (Fallback):
 * 1. Intenta consultar el endpoint real del backend `/categories`.
 * 2. Si la respuesta es exitosa y contiene datos, los retorna.
 * 3. Si el backend está apagado o falla la red, captura el error y retorna
 *    la colección local `mockCategories` para garantizar que la interfaz siga funcionando en la demo.
 * 
 * @returns {Promise<Category[]>} Array de categorías.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await apiFetch<ApiResponse<Category[]>>('/categories')
    if (response.success && Array.isArray(response.data) && response.data.length > 0) {
      return response.data
    }
  } catch (error) {
    console.warn('Backend categories endpoint not reachable, fallback to mocks:', error)
  }
  return mockCategories
}

/**
 * Obtiene la información detallada de una categoría a partir de su ID o Slug.
 * 
 * Estrategia:
 * 1. Consulta al backend `/categories/:idOrSlug`.
 * 2. Si falla o no está disponible, busca la coincidencia dentro de los datos simulados `mockCategories`.
 * 
 * @param {string} idOrSlug - Identificador o slug de la categoría.
 * @returns {Promise<Category | undefined>} La categoría encontrada o undefined.
 */
export async function getCategoryById(idOrSlug: string): Promise<Category | undefined> {
  try {
    const response = await apiFetch<ApiResponse<Category>>(`/categories/${idOrSlug}`)
    if (response.success && response.data) {
      return response.data
    }
  } catch (error) {
    console.warn(`Backend category ${idOrSlug} endpoint not reachable, fallback to mocks:`, error)
  }
  return mockCategories.find((c) => c.id === idOrSlug || c.slug === idOrSlug)
}
