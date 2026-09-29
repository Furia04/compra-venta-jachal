import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { marketplaceApi, FALLBACK_PRODUCTS } from '../services/marketplaceApi'
import type { Product } from '../types/product'
import { 
  Car, 
  Home as HomeIcon, 
  Smartphone, 
  Sofa, 
  Bike, 
  Package, 
  Loader2, 
  Search, 
  ShieldCheck, 
  MessageSquare, 
  Tag,
  ArrowRight
} from 'lucide-react'

const CATEGORIES = [
  { id: '', name: 'Todos los artículos', icon: Package },
  { id: 'vehiculos', name: 'Vehículos & Autos', icon: Car },
  { id: 'inmuebles', name: 'Inmuebles & Terrenos', icon: HomeIcon },
  { id: 'tecnologia', name: 'Tecnología & Celulares', icon: Smartphone },
  { id: 'hogar', name: 'Hogar & Muebles', icon: Sofa },
  { id: 'deportes', name: 'Deportes & Bicicletas', icon: Bike },
]

export default function MarketplaceHome() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('categoria') || ''
  const searchParam = searchParams.get('search') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [searchInput, setSearchInput] = useState(searchParam)
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim())
    } else {
      newParams.delete('search')
    }
    setSearchParams(newParams)
  }

  return (
    <div className="min-h-screen pb-16">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 text-white pt-12 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-purple-200 text-xs font-semibold mb-4 border border-white/10">
            <Tag size={12} className="text-purple-300" />
            <span>Compra y venta directa en Jáchal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 text-balance">
            El mercado de la comunidad de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-200">Jáchal</span>
          </h1>
          
          <p className="text-sm sm:text-base text-purple-100/80 max-w-2xl mx-auto mb-8 text-pretty">
            Encontrá autos, motos, herramientas, muebles y tecnología de vecinos de la zona. Trato directo y sin intermediarios.
          </p>

          {/* Large Hero Search Box */}
          <form 
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-white p-1.5 sm:p-2 rounded-2xl shadow-xl shadow-purple-950/40 border border-white/20 flex items-center gap-2"
          >
            <div className="flex-1 flex items-center pl-3 text-slate-400">
              <Search size={18} className="text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="¿Qué estás buscando hoy en Jáchal? (ej: Gol 2018, Bicicleta...)"
                className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              Buscar
            </button>
          </form>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs text-purple-200/75">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Publicaciones 100% locales</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare size={14} className="text-emerald-400" />
              <span>Contacto directo por WhatsApp</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag size={14} className="text-emerald-400" />
              <span>Sin comisiones ni costos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        
        {/* Categories Carousel / Grid */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-sm mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Explorar por Categoría
            </h2>
            {currentCategory && (
              <button
                onClick={() => handleCategoryClick('')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
              >
                Limpiar filtro
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
            {CATEGORIES.map((category) => {
              const Icon = category.icon
              const isSelected = (currentCategory === '' && category.id === '') || currentCategory === category.id
              return (
                <button 
                  key={category.id || 'all'}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl transition-all cursor-pointer text-center group border ${
                    isSelected 
                      ? 'bg-purple-50 text-purple-900 border-purple-300 ring-2 ring-purple-500/20 shadow-xs' 
                      : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all ${
                    isSelected 
                      ? 'bg-purple-600 text-white shadow-xs' 
                      : 'bg-white text-slate-600 border border-slate-200/60 group-hover:text-purple-600 group-hover:border-purple-200'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-purple-950' : 'group-hover:text-slate-900'}`}>
                    {category.name}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Listings Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {searchParam
                  ? `Resultados para "${searchParam}"`
                  : currentCategory 
                    ? `${CATEGORIES.find(c => c.id === currentCategory)?.name}` 
                    : 'Publicaciones Recientes'}
              </h2>
              {usingFallback && (
                <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  Demostración
                </span>
              )}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Mostrando <span className="font-bold text-slate-800">{products.length}</span> artículos en Jáchal
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200/80">
              <Loader2 className="animate-spin text-purple-600 mb-3" size={32} />
              <p className="text-xs font-semibold text-slate-500">Cargando publicaciones...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No hay publicaciones con estos filtros</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Probá buscando con otras palabras o limpiando la categoría seleccionada.
              </p>
              <button 
                onClick={() => {
                  setSelectedCategory('')
                  setSearchInput('')
                  setSearchParams({})
                }}
                className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-purple-700 transition-colors shadow-xs cursor-pointer"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Bottom CTA Banner */}
        <section className="mt-16 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-purple-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black mb-2 tracking-tight">
              ¿Tenés algo para vender en Jáchal?
            </h3>
            <p className="text-xs sm:text-sm text-purple-100 max-w-xl">
              Publicá tu auto, moto, terreno, teléfono o herramientas en minutos. Es gratis y conectás directo por WhatsApp con compradores locales.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/mercado/publicar'}
            className="shrink-0 bg-white text-purple-900 hover:bg-purple-50 font-bold px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm cursor-pointer"
          >
            <span>Publicar artículo gratis</span>
            <ArrowRight size={16} />
          </button>
        </section>

      </div>

    </div>
  )
}
