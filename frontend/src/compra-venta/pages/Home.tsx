import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { marketplaceApi, FALLBACK_PRODUCTS } from '../services/marketplaceApi'
import type { Product } from '../types/product'
import { Car, Home as HomeIcon, Smartphone, Sofa, Bike, Package, Loader2 } from 'lucide-react'

const CATEGORIES = [
  { id: '', name: 'Todos', icon: Package },
  { id: 'vehiculos', name: 'Vehículos', icon: Car },
  { id: 'inmuebles', name: 'Inmuebles', icon: HomeIcon },
  { id: 'tecnologia', name: 'Tecnología', icon: Smartphone },
  { id: 'hogar', name: 'Hogar', icon: Sofa },
  { id: 'deportes', name: 'Deportes', icon: Bike },
]

export default function MarketplaceHome() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('categoria') || ''
  const searchParam = searchParams.get('search') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  const currentCategory = categoryParam !== '' ? categoryParam : selectedCategory

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const data = await marketplaceApi.getProducts({
          category: currentCategory || undefined,
          search: searchParam || undefined,
        })
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
          setUsingFallback(false)
        } else {
          setProducts(FALLBACK_PRODUCTS)
          setUsingFallback(true)
        }
      } catch (err) {
        console.warn('API no disponible, usando publicaciones de demostración:', err)
        setProducts(FALLBACK_PRODUCTS)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [currentCategory, searchParam])

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId)
    const newParams = new URLSearchParams(searchParams)
    if (catId) {
      newParams.set('categoria', catId)
    } else {
      newParams.delete('categoria')
    }
    setSearchParams(newParams)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Categorías Populares</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {CATEGORIES.map((category) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.id
            return (
              <button 
                key={category.id || 'all'}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl shadow-sm border transition-all cursor-pointer group ${
                  isSelected 
                    ? 'bg-brand-500 text-white border-brand-500 shadow-md' 
                    : 'bg-white text-gray-700 border-gray-100 hover:border-brand-500 hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-500 group-hover:bg-brand-500 group-hover:text-white'
                }`}>
                  <Icon size={24} />
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'group-hover:text-brand-500'}`}>
                  {category.name}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Recent Listings */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-gray-800">
              {searchParam
                ? `Resultados para "${searchParam}"`
                : currentCategory 
                  ? `Publicaciones en ${CATEGORIES.find(c => c.id === currentCategory)?.name}` 
                  : 'Recién Publicados'}
            </h2>
            {usingFallback && (
              <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                Modo Demo
              </span>
            )}
          </div>
          {(selectedCategory || searchParam) && (
            <button 
              onClick={() => {
                setSelectedCategory('')
                setSearchParams({})
              }}
              className="text-sm font-medium text-brand-600 hover:text-brand-700 cursor-pointer"
            >
              Ver todas las publicaciones &rarr;
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-3 text-brand-500" size={36} />
            <p className="text-sm">Cargando publicaciones de Jáchal...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8">
            <p className="text-gray-500 text-lg mb-4">No hay publicaciones disponibles en esta categoría.</p>
            <button 
              onClick={() => {
                setSelectedCategory('')
                setSearchParams({})
              }}
              className="bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
