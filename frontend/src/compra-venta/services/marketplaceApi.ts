import type { Product } from '../types/product'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Catálogo de productos simulados (Mock Data) para demostración o funcionamiento offline.
 */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    _id: 'mock-1',
    title: 'Volkswagen Gol Trend 1.6 2018',
    price: 8500000,
    category: 'vehiculos',
    images: [{ url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400' }],
    location: 'Centro, Jáchal',
    description: 'Excelente estado general, 75.000 km reales, services al día. Papeles al día listo para transferir.',
    createdAt: new Date().toISOString(),
    user: {
      name: 'Carlos Gómez',
      phone: '2645112233',
      location: 'Centro, Jáchal',
      isVerified: true
    }
  },
  {
    _id: 'mock-2',
    title: 'iPhone 13 Pro Max 256gb Libre Impecable',
    price: 950000,
    category: 'tecnologia',
    images: [{ url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=400' }],
    location: 'San José de Jáchal',
    description: 'Batería 89%, con caja y accesorios originales. Sin detalles de uso.',
    createdAt: new Date().toISOString(),
    user: {
      name: 'Matías Perez',
      phone: '2644998877',
      location: 'San José de Jáchal',
      isVerified: true
    }
  },
  {
    _id: 'mock-3',
    title: 'Bicicleta Mountain Bike Venzo Rodado 29',
    price: 280000,
    category: 'deportes',
    images: [{ url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400' }],
    location: 'Niquivil',
    description: 'Cuadro de aluminio, frenos a disco hidráulicos Shimano, cubiertas nuevas.',
    createdAt: new Date().toISOString(),
    user: {
      name: 'Lucía Fernández',
      phone: '2646334455',
      location: 'Niquivil',
      isVerified: false
    }
  },
  {
    _id: 'mock-4',
    title: 'Sillón 3 Cuerpos Chenille Gris',
    price: 150000,
    category: 'hogar',
    images: [{ url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=400' }],
    location: 'Centro, Jáchal',
    description: 'Estructura reforzada en madera maciza, tela lavable antimanchas.',
    createdAt: new Date().toISOString(),
    user: {
      name: 'Roberto Díaz',
      phone: '2645778899',
      location: 'Centro, Jáchal',
      isVerified: false
    }
  }
]

/**
 * Función auxiliar de petición HTTP para el módulo Marketplace.
 * Gestiona automáticamente el encabezado Authorization con el token JWT almacenado en `localStorage`.
 * 
 * @template T - Tipo esperado de respuesta.
 * @param {string} endpoint - Ruta relativa del endpoint.
 * @param {RequestInit} [options={}] - Configuración de la petición fetch.
 * @returns {Promise<T>} Datos deserializados de la respuesta.
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {})
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    let errorMsg = `Error HTTP ${response.status}`
    try {
      const errJson = await response.json()
      if (errJson?.message) errorMsg = errJson.message
    } catch {
      // Ignorar error de parsing
    }
    throw new Error(errorMsg)
  }

  return response.json()
}

/**
 * Objeto que agrupa todos los servicios de la API para el módulo de Compra-Venta / Marketplace.
 */
export const marketplaceApi = {
  /**
   * Consulta el catálogo de productos publicados con filtros de categoría y texto de búsqueda.
   * Cuenta con fallback a productos de muestra si el endpoint no responde.
   */
  getProducts: async (params?: { category?: string; search?: string }): Promise<Product[]> => {
    try {
      const query = new URLSearchParams()
      if (params?.category) query.append('category', params.category)
      if (params?.search) query.append('search', params.search)
      const endpoint = `/products${query.toString() ? `?${query.toString()}` : ''}`
      const res = await request<{ success?: boolean; data?: Product[] } | Product[]>(endpoint)
      if (Array.isArray(res)) return res
      if (res && Array.isArray(res.data) && res.data.length > 0) return res.data
    } catch (err) {
      console.warn('API de productos no disponible, usando demostración:', err)
    }
    let filtered = FALLBACK_PRODUCTS
    if (params?.category) {
      filtered = filtered.filter((p) => p.category === params.category)
    }
    if (params?.search) {
      const q = params.search.toLowerCase()
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
    }
    return filtered
  },

  /**
   * Obtiene un producto por su identificador único.
   */
  getProductById: async (id: string): Promise<Product> => {
    try {
      const res = await request<{ success?: boolean; data?: Product } | Product>(`/products/${id}`)
      if ('data' in res && res.data) return res.data
      if ('_id' in res) return res as Product
    } catch (err) {
      console.warn(`Producto ${id} no encontrado en API, buscando en fallback:`, err)
    }
    const found = FALLBACK_PRODUCTS.find((p) => p._id === id || p.id === id)
    if (found) return found
    return FALLBACK_PRODUCTS[0]
  },

  /**
   * Publica un nuevo producto a la venta (soporta FormData con imágenes o JSON).
   */
  createProduct: async (formData: FormData | Record<string, unknown>): Promise<Product> => {
    const isFormData = formData instanceof FormData
    return request<Product>('/products', {
      method: 'POST',
      body: isFormData ? formData : JSON.stringify(formData)
    })
  },

  /**
   * Elimina una publicación de producto por su ID.
   */
  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    return request<{ success: boolean }>(`/products/${id}`, {
      method: 'DELETE'
    })
  },

  /**
   * Obtiene las publicaciones activas del usuario autenticado.
   */
  getMyListings: async (): Promise<Product[]> => {
    try {
      return await request<Product[]>('/products/user/my-listings')
    } catch {
      return FALLBACK_PRODUCTS.slice(0, 2)
    }
  },

  /**
   * Registra un nuevo usuario en la plataforma.
   */
  register: async (userData: Record<string, unknown>) => {
    return request<{ token: string; _id: string; name: string; email: string; phone?: string; location?: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  },

  /**
   * Inicia sesión con credenciales y obtiene el token JWT.
   */
  login: async (credentials: Record<string, unknown>) => {
    return request<{ token: string; _id: string; name: string; email: string; phone?: string; location?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  },

  /**
   * Obtiene los datos del usuario en sesión actual.
   */
  getMe: async () => {
    return request<{ _id: string; name: string; email: string; phone?: string; location?: string }>('/auth/me')
  }
}
