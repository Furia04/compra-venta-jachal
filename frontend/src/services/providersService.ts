import { apiFetch } from './api'
import type { ApiResponse } from './api'
import type { Worker } from '../types/worker'
import { mockWorkers } from '../data/mockWorkers'

/**
 * Obtiene la lista de prestadores de servicios / trabajadores registrados.
 * 
 * Estrategia de resiliencia (Fallback):
 * 1. Intenta consultar el endpoint `/providers` en el backend.
 * 2. Si responde satisfactoriamente, retorna la información de la base de datos.
 * 3. Si ocurre un fallo de red o el backend está inactivo, recurre a `mockWorkers`
 *    para permitir la navegación continua en presentaciones y entornos sin conexión.
 * 
 * @returns {Promise<Worker[]>} Lista de prestadores.
 */
export async function getProviders(): Promise<Worker[]> {
  try {
    const response = await apiFetch<ApiResponse<Worker[]>>('/providers')
    if (response.success && Array.isArray(response.data) && response.data.length > 0) {
      return response.data
    }
  } catch (error) {
    console.warn('Backend providers endpoint not reachable, fallback to mocks:', error)
  }
  return mockWorkers
}

/**
 * Obtiene los detalles de un prestador por su identificador único.
 * 
 * @param {string} id - UUID o ID del prestador.
 * @returns {Promise<Worker | undefined>} Prestador encontrado o undefined.
 */
export async function getProviderById(id: string): Promise<Worker | undefined> {
  try {
    const response = await apiFetch<ApiResponse<Worker>>(`/providers/${id}`)
    if (response.success && response.data) {
      return response.data
    }
  } catch (error) {
    console.warn(`Backend provider ${id} endpoint not reachable, fallback to mocks:`, error)
  }
  return mockWorkers.find((w) => w.id === id)
}
