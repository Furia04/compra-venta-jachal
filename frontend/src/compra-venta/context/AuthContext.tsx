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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser))
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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
