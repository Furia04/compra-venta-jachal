import { apiFetch } from './api'
import type { ApiResponse } from './api'
import type { Worker } from '../types/worker'
import { mockWorkers } from '../data/mockWorkers'

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
