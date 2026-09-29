export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Interfaz genérica para estandarizar las respuestas JSON del backend.
 */
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

/**
 * Cliente HTTP base reutilizable para realizar peticiones fetch al backend de OficiosYa.
 * 
 * Funcionalidad:
 * 1. Resuelve la URL completa agregando la base configurada en `VITE_API_URL`.
 * 2. Inyecta por defecto la cabecera `Content-Type: application/json`.
 * 3. Evalúa si la respuesta HTTP es exitosa (`response.ok`).
 * 4. Si el servidor devuelve un error, extrae el mensaje de error de la respuesta JSON y lanza una excepción `Error`.
 * 5. Si todo está correcto, parsea y retorna el cuerpo en formato JSON tipado con `Promise<T>`.
 * 
 * @template T - Tipo de dato esperado en la respuesta.
 * @param endpoint - Ruta relativa del endpoint (ej. '/categories') o URL absoluta.
 * @param options - Opciones de configuración de fetch (method, headers, body, etc.).
 * @returns Promesa con los datos tipados de la respuesta.
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