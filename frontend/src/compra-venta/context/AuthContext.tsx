import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { marketplaceApi } from '../services/marketplaceApi'

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  location?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (credentials: { email: string; password: string }) => Promise<User | undefined>
  register: (userData: Record<string, unknown>) => Promise<User | undefined>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Proveedor de Contexto de Autenticación para el Frontend.
 * 
 * Responsabilidades:
 * 1. Mantener en memoria el estado global de la sesión (`user`, `loading`, `isAuthenticated`).
 * 2. Persistir el token JWT y los datos del usuario en `localStorage`.
 * 3. Restaurar y validar la sesión al cargar la página (`useEffect -> loadUser`).
 * 4. Exponer funciones para `login`, `register` y `logout`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Al montar la aplicación, recupera la sesión almacenada en localStorage
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser))
          // Validar y refrescar datos con el backend
          const freshUser = await marketplaceApi.getMe()
          if (freshUser) {
            setUser(freshUser)
            localStorage.setItem('user', JSON.stringify(freshUser))
          }
        } catch (err) {
          console.warn('Sesión expirada o inválida:', err)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  /**
   * Inicia sesión del usuario, guarda el token en localStorage y actualiza el estado.
   */
  const login = async (credentials: { email: string; password: string }) => {
    const data = await marketplaceApi.login(credentials)
    if (data && data.token) {
      localStorage.setItem('token', data.token)
      const userData: User = {
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
      }
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return userData
    }
  }

  /**
   * Registra un nuevo usuario en la API y guarda su sesión.
   */
  const register = async (userData: Record<string, unknown>) => {
    const data = await marketplaceApi.register(userData)
    if (data && data.token) {
      localStorage.setItem('token', data.token)
      const userObj: User = {
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
      }
      localStorage.setItem('user', JSON.stringify(userObj))
      setUser(userObj)
      return userObj
    }
  }

  /**
   * Cierra la sesión activa y elimina las credenciales del almacenamiento local.
   */
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook personalizado para consumir el contexto de autenticación en cualquier componente.
 * @throws {Error} si se utiliza fuera del AuthProvider.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
