import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { marketplaceApi, FALLBACK_PRODUCTS } from '../services/marketplaceApi'
import type { Product } from '../types/product'
import { 
  Car, 
  Home as HomeIcon, 
  Smartphone, 
  Sofa, 
  Bike, 
  Loader2
} from 'lucide-react'

const CATEGORIES = [
  { id: 'vehiculos', name: 'Vehículos', icon: Car },
  { id: 'inmuebles', name: 'Inmuebles', icon: HomeIcon },
  { id: 'tecnologia', name: 'Tecnología', icon: Smartphone },
  { id: 'hogar', name: 'Hogar', icon: Sofa },
  { id: 'deportes', name: 'Deportes', icon: Bike },
]

export default function MarketplaceHome() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const categoryParam = searchParams.get('categoria') || ''
  const searchParam = searchParams.get('search') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [searchInput, setSearchInput] = useState(searchParam)
  const [loading, setLoading] = useState(true)

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
        } else {
          setProducts(FALLBACK_PRODUCTS)
        }
      } catch (err) {
        setProducts(FALLBACK_PRODUCTS)
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
    <div>
      {/* Hero identical to OficiosYa */}
      <section style={{ padding: '2rem 1.5rem', textAlign: 'center', backgroundColor: 'var(--color-bg-secondary)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem', lineHeight: 1.3 }}>
          El mercado de la comunidad de Jáchal
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: '40ch', margin: '0 auto' }}>
          Encontrá autos, herramientas, muebles y tecnología. Trato directo y sin intermediarios.
        </p>
      </section>

      {/* Search Bar identical to OficiosYa */}
      <form 
        onSubmit={handleSearchSubmit} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxWidth: '500px',
          margin: '2rem auto',
          padding: '0 1.5rem'
        }}
      >
        <input
          type="text"
          placeholder="¿Qué estás buscando? Ej: Bicicleta, Celular..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            padding: '1rem',
            fontSize: '1rem',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            width: '100%'
          }}
        />
        <button 
          type="submit"
          style={{
            padding: '1rem',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            width: '100%',
            cursor: 'pointer'
          }}
        >
          Buscar artículo
        </button>
      </form>

      {/* Categories identical to CategoryList */}
      <section style={{ padding: '2rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Explorar Categorías
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {CATEGORIES.map((category) => {
            const Icon = category.icon
            const isSelected = currentCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id === currentCategory ? '' : category.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  padding: '1rem',
                  backgroundColor: 'var(--color-surface)',
                  border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: '8px',
                  textAlign: 'center',
                  minHeight: '100px',
                  cursor: 'pointer',
                  color: 'var(--color-text)'
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: isSelected ? 'var(--color-primary)' : 'inherit' }}>
                  <Icon size={28} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {category.name}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1.5rem' }}>
          {searchParam
            ? `Resultados para "${searchParam}"`
            : currentCategory 
              ? `${CATEGORIES.find(c => c.id === currentCategory)?.name}` 
              : 'Publicaciones Recientes'}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', color: 'var(--color-primary)' }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)' }}>
            No hay publicaciones con estos filtros.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Call to Action identical to WorkerCallToAction */}
      <section style={{
        backgroundColor: 'var(--color-bg-secondary)',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        marginTop: '2rem'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
          ¿Tenés algo para vender en Jáchal?
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Publicá tu auto, terreno, teléfono o herramientas en minutos. Es gratis y conectás directo por WhatsApp.
        </p>
        <button
          onClick={() => navigate('/mercado/publicar')}
          style={{
            padding: '1rem 2rem',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Publicar artículo gratis
        </button>
      </section>
    </div>
  )
}
