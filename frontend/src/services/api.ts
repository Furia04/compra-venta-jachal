export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

/**
 * Cliente HTTP base para realizar peticiones al backend de OficiosYa.
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let errorMessage = `Error HTTP ${response.status}: ${response.statusText}`
    try {
      const errorJson = await response.json()
      if (errorJson?.message) {
        errorMessage = errorJson.message
      }
    } catch {
      // Si la respuesta no es JSON, se conserva el mensaje genérico
    }
    throw new Error(errorMessage)
  }

  return response.json()
}