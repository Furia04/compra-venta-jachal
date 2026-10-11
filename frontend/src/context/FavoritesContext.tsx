import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Worker } from '../types/worker'
import type { Product } from '../compra-venta/types/product'
import { useToast } from './ToastContext'

interface FavoritesContextType {
  favoriteWorkerIds: string[]
  favoriteProductIds: string[]
  isWorkerFavorite: (id: string) => boolean
  isProductFavorite: (id: string) => boolean
  toggleWorkerFavorite: (worker: Worker) => void
  toggleProductFavorite: (product: Product) => void
  favoriteWorkers: Worker[]
  favoriteProducts: Product[]
  totalFavoritesCount: number
}

const FAVORITE_WORKERS_KEY = 'oficiosya_fav_workers'
const FAVORITE_PRODUCTS_KEY = 'oficiosya_fav_products'

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { showSuccess, showInfo } = useToast()
  const [favoriteWorkers, setFavoriteWorkers] = useState<Worker[]>([])
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])

  // Cargar favoritos al montar
  useEffect(() => {
    try {
      const savedWorkers = localStorage.getItem(FAVORITE_WORKERS_KEY)
      if (savedWorkers) {
        setFavoriteWorkers(JSON.parse(savedWorkers))
      }
      const savedProducts = localStorage.getItem(FAVORITE_PRODUCTS_KEY)
      if (savedProducts) {
        setFavoriteProducts(JSON.parse(savedProducts))
      }
    } catch (err) {
      console.error('Error cargando favoritos de localStorage:', err)
    }
  }, [])

  const favoriteWorkerIds = favoriteWorkers.map(w => w.id)
  const favoriteProductIds = favoriteProducts.map(p => p._id || p.id || '')

  const isWorkerFavorite = useCallback((id: string) => {
    return favoriteWorkerIds.includes(id)
  }, [favoriteWorkerIds])

  const isProductFavorite = useCallback((id: string) => {
    return favoriteProductIds.includes(id)
  }, [favoriteProductIds])

  const toggleWorkerFavorite = useCallback((worker: Worker) => {
    setFavoriteWorkers(prev => {
      const exists = prev.some(w => w.id === worker.id)
      let updated: Worker[]
      if (exists) {
        updated = prev.filter(w => w.id !== worker.id)
        showInfo(`Eliminado de guardados: ${worker.firstName} ${worker.lastName}`)
      } else {
        updated = [worker, ...prev]
        showSuccess(`Guardado en favoritos: ${worker.firstName} ${worker.lastName}`)
      }
      try {
        localStorage.setItem(FAVORITE_WORKERS_KEY, JSON.stringify(updated))
      } catch (err) {
        console.error('Error guardando fav workers:', err)
      }
      return updated
    })
  }, [showSuccess, showInfo])

  const toggleProductFavorite = useCallback((product: Product) => {
    const pId = product._id || product.id || ''
    setFavoriteProducts(prev => {
      const exists = prev.some(p => (p._id || p.id) === pId)
      let updated: Product[]
      if (exists) {
        updated = prev.filter(p => (p._id || p.id) !== pId)
        showInfo(`Eliminado de guardados: ${product.title}`)
      } else {
        updated = [product, ...prev]
        showSuccess(`Guardado en favoritos: ${product.title}`)
      }
      try {
        localStorage.setItem(FAVORITE_PRODUCTS_KEY, JSON.stringify(updated))
      } catch (err) {
        console.error('Error guardando fav products:', err)
      }
      return updated
    })
  }, [showSuccess, showInfo])

  const totalFavoritesCount = favoriteWorkers.length + favoriteProducts.length

  return (
    <FavoritesContext.Provider
      value={{
        favoriteWorkerIds,
        favoriteProductIds,
        isWorkerFavorite,
        isProductFavorite,
        toggleWorkerFavorite,
        toggleProductFavorite,
        favoriteWorkers,
        favoriteProducts,
        totalFavoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de un FavoritesProvider')
  }
  return context
}
