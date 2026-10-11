import { apiFetch } from './api'
import type { ApiResponse } from './api'
import type { Worker } from '../types/worker'
import type { Rating } from '../types/rating'
import { mockWorkers } from '../data/mockWorkers'
import { mockRatings } from '../data/mockRatings'

// Almacenamiento en memoria/local de trabajadores agregados dinámicamente
const LOCAL_STORAGE_WORKERS_KEY = 'oficiosya_custom_workers'
const LOCAL_STORAGE_REQUESTS_KEY = 'oficiosya_service_requests'

function getStoredWorkers(): Worker[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_WORKERS_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (err) {
    console.error('Error reading custom workers from localStorage:', err)
  }
  return []
}

function saveStoredWorkers(workers: Worker[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_WORKERS_KEY, JSON.stringify(workers))
  } catch (err) {
    console.error('Error saving custom workers to localStorage:', err)
  }
}

/**
 * Obtiene la lista de prestadores de servicios / trabajadores registrados.
 * Combina datos del backend/mock con los creados localmente.
 * 
 * @returns {Promise<Worker[]>} Lista de prestadores.
 */
export async function getProviders(): Promise<Worker[]> {
  const customWorkers = getStoredWorkers()
  let baseWorkers = mockWorkers

  try {
    const response = await apiFetch<ApiResponse<Worker[]>>('/providers')
    if (response.success && Array.isArray(response.data) && response.data.length > 0) {
      baseWorkers = response.data
    }
  } catch (error) {
    console.warn('Backend providers endpoint not reachable, fallback to mocks:', error)
  }

  // Mezclar evitando duplicados por ID
  const allWorkers = [...customWorkers]
  baseWorkers.forEach((w) => {
    if (!allWorkers.some((cw) => cw.id === w.id)) {
      allWorkers.push(w)
    }
  })

  return allWorkers
}

/**
 * Obtiene los detalles de un prestador por su identificador único.
 * 
 * @param {string} id - UUID o ID del prestador.
 * @returns {Promise<Worker | undefined>} Prestador encontrado o undefined.
 */
export async function getProviderById(id: string): Promise<Worker | undefined> {
  const customWorkers = getStoredWorkers()
  const custom = customWorkers.find((w) => w.id === id)
  if (custom) return custom

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

const LOCAL_STORAGE_RATINGS_KEY = 'oficiosya_custom_ratings'

function getStoredRatings(): Rating[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_RATINGS_KEY)
    if (saved) return JSON.parse(saved)
  } catch (err) {
    console.error('Error reading custom ratings from localStorage:', err)
  }
  return []
}

function saveStoredRatings(ratings: Rating[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_RATINGS_KEY, JSON.stringify(ratings))
  } catch (err) {
    console.error('Error saving custom ratings to localStorage:', err)
  }
}

/**
 * Obtiene las reseñas y calificaciones de un prestador.
 * 
 * @param {string} workerId - ID del prestador.
 * @returns {Promise<Rating[]>} Reseñas asociadas.
 */
export async function getRatingsByWorkerId(workerId: string): Promise<Rating[]> {
  const customRatings = getStoredRatings().filter((r) => r.workerId === workerId)

  try {
    const response = await apiFetch<ApiResponse<Rating[]>>(`/providers/${workerId}/ratings`)
    if (response.success && Array.isArray(response.data)) {
      return [...customRatings, ...response.data]
    }
  } catch (error) {
    console.warn(`Backend ratings for ${workerId} not reachable, fallback to mocks:`, error)
  }
  return [...customRatings, ...mockRatings.filter((r) => r.workerId === workerId)]
}

/**
 * Registra una nueva calificación y reseña para un prestador.
 * Recalcula el promedio de estrellas y número de opiniones.
 * 
 * @param {string} workerId - ID del prestador.
 * @param {Object} ratingData - Puntuación y comentario.
 * @returns {Promise<{ rating: Rating; updatedWorker?: Worker }>}
 */
export async function addWorkerRating(
  workerId: string,
  ratingData: { clientName: string; score: number; comment?: string }
): Promise<{ rating: Rating; updatedWorker?: Worker }> {
  const newRating: Rating = {
    id: `rating-${Date.now()}`,
    workerId,
    clientId: `user-${Date.now()}`,
    clientName: ratingData.clientName || 'Vecino de Jáchal',
    score: ratingData.score,
    comment: ratingData.comment || '',
    createdAt: new Date().toISOString(),
  }

  // Guardar en localStorage de reseñas
  const currentRatings = getStoredRatings()
  saveStoredRatings([newRating, ...currentRatings])

  // Obtener todas las calificaciones de este trabajador para recalcular promedio
  const allForWorker = [newRating, ...currentRatings.filter(r => r.workerId === workerId), ...mockRatings.filter(r => r.workerId === workerId)]
  const totalScore = allForWorker.reduce((acc, curr) => acc + curr.score, 0)
  const averageRating = Number((totalScore / allForWorker.length).toFixed(1))
  const reviewCount = allForWorker.length

  // Actualizar trabajador en localStorage si existe, o guardarlo como modificado
  const customWorkers = getStoredWorkers()
  let targetWorker = customWorkers.find(w => w.id === workerId)
  if (!targetWorker) {
    const baseWorker = mockWorkers.find(w => w.id === workerId)
    if (baseWorker) {
      targetWorker = { ...baseWorker }
      customWorkers.push(targetWorker)
    }
  }

  if (targetWorker) {
    targetWorker.averageRating = averageRating
    targetWorker.reviewCount = reviewCount
    saveStoredWorkers(customWorkers)
  }

  return { rating: newRating, updatedWorker: targetWorker }
}

/**
 * Registra un nuevo prestador/trabajador en la plataforma.
 * 
 * @param workerData - Datos del nuevo trabajador.
 * @returns {Promise<Worker>} Trabajador creado.
 */
export async function registerWorker(
  workerData: Omit<Worker, 'id' | 'averageRating' | 'reviewCount' | 'premiumStatus'> &
    Partial<Pick<Worker, 'averageRating' | 'reviewCount' | 'premiumStatus'>>
): Promise<Worker> {
  const newWorker: Worker = {
    ...workerData,
    id: `worker-${Date.now()}`,
    averageRating: workerData.averageRating ?? 5.0,
    reviewCount: workerData.reviewCount ?? 1,
    premiumStatus: workerData.premiumStatus ?? 'normal'
  }

  try {
    const response = await apiFetch<ApiResponse<Worker>>('/providers', {
      method: 'POST',
      body: JSON.stringify(newWorker)
    })
    if (response.success && response.data) {
      return response.data
    }
  } catch (error) {
    console.warn('Backend provider registration not reachable, saving to local state:', error)
  }

  const existing = getStoredWorkers()
  const updated = [newWorker, ...existing]
  saveStoredWorkers(updated)

  return newWorker
}

export interface ServiceRequestPayload {
  workerId?: string
  workerName?: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  category: string
  title: string
  description: string
  location: string
  urgency: 'baja' | 'media' | 'alta'
  preferredDate?: string
}

/**
 * Envía una solicitud de servicio / presupuesto a un prestador.
 * 
 * @param {ServiceRequestPayload} payload - Datos de la solicitud.
 * @returns {Promise<{ success: boolean; id: string }>}
 */
export async function submitServiceRequest(payload: ServiceRequestPayload): Promise<{ success: boolean; id: string }> {
  try {
    const response = await apiFetch<ApiResponse<{ id: string }>>('/service-requests', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    if (response.success && response.data) {
      return { success: true, id: response.data.id }
    }
  } catch (error) {
    console.warn('Backend service request endpoint not reachable, saving to local store:', error)
  }

  const reqId = `req-${Date.now()}`
  try {
    const prev = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REQUESTS_KEY) || '[]')
    prev.push({ ...payload, id: reqId, createdAt: new Date().toISOString(), status: 'PENDING' })
    localStorage.setItem(LOCAL_STORAGE_REQUESTS_KEY, JSON.stringify(prev))
  } catch (err) {
    console.error('Error saving request locally:', err)
  }

  return { success: true, id: reqId }
}
