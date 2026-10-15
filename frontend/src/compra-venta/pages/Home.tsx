import React, { useEffect, useState, useMemo } from 'react'
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
  Loader2,
  SlidersHorizontal,
  RotateCcw,
  Search,
  Sparkles
} from 'lucide-react'

const CATEGORIES = [
  { id: 'todos', name: 'Todos', icon: Sparkles },
  { id: 'vehiculos', name: 'Vehículos', icon: Car },
  { id: 'inmuebles', name: 'Inmuebles', icon: HomeIcon },
  { id: 'tecnologia', name: 'Tecnología', icon: Smartphone },
  { id: 'hogar', name: 'Hogar', icon: Sofa },
  { id: 'deportes', name: 'Deportes', icon: Bike },
]

const LOCATIONS = [
  'Todas las zonas',
  'Centro, Jáchal',
  'San José de Jáchal',
  'Villa Mercedes',
  'Niquivil',
  'Huaco',
  'Pampa Vieja',
  'Gran China'
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

  // Filtros avanzados
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('Todas las zonas')
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc'>('recent')
  const [showFilters, setShowFilters] = useState(false)

  const currentCategory = categoryParam !== '' ? categoryParam : selectedCategory

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const data = await marketplaceApi.getProducts({
          category: currentCategory && currentCategory !== 'todos' ? currentCategory : undefined,
          search: searchParam || undefined,
        })
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
        } else {
          setProducts(FALLBACK_PRODUCTS)
        }
      } catch (err) {
        console.warn('Error fetching products, using fallback:', err)
        setProducts(FALLBACK_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [currentCategory, searchParam])

  const handleCategoryClick = (catId: string) => {
    const finalId = catId === 'todos' ? '' : catId
    setSelectedCategory(finalId)
    const newParams = new URLSearchParams(searchParams)
    if (finalId) {
      newParams.set('categoria', finalId)
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

  const handleResetFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setSelectedLocation('Todas las zonas')
    setSortBy('recent')
    setSearchInput('')
    setSelectedCategory('')
    setSearchParams(new URLSearchParams())
  }

  // Filtrado y ordenamiento en cliente
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filtro por precio mínimo
    if (minPrice && !isNaN(Number(minPrice))) {
      result = result.filter(p => p.price >= Number(minPrice))
    }

    // Filtro por precio máximo
    if (maxPrice && !isNaN(Number(maxPrice))) {
      result = result.filter(p => p.price <= Number(maxPrice))
    }

    // Filtro por ubicación
    if (selectedLocation !== 'Todas las zonas') {
      result = result.filter(p => 
        p.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        selectedLocation.toLowerCase().includes(p.location.toLowerCase())
      )
    }

    // Ordenamiento
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    } else {
      // 'recent'
      result.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return timeB - timeA
      })
    }

    return result
  }, [products, minPrice, maxPrice, selectedLocation, sortBy])

  const hasActiveFilters = Boolean(minPrice || maxPrice || (selectedLocation !== 'Todas las zonas') || currentCategory || searchParam)

  return (
    <div>
      {/* Hero */}
      <section style={{ 
        padding: 'clamp(2rem, 5vw, 3rem) 1rem', 
        textAlign: 'center', 
        backgroundColor: 'var(--color-bg-secondary)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.25rem)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Jáchal Vende 🛒
        </h1>
        <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', color: 'var(--color-text-secondary)', maxWidth: '550px', margin: '0 auto', lineHeight: 1.5 }}>
          El punto de encuentro para comprar y vender productos en Jáchal. Contacto directo por WhatsApp sin intermediarios ni comisiones.
        </p>
      </section>

      {/* Search Bar & Filter Toggle */}
      <div className="responsive-container" style={{ marginTop: '1.25rem' }}>
        <form 
          onSubmit={handleSearchSubmit} 
          className="flex flex-wrap sm:flex-nowrap gap-2 items-center"
        >
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 0 }}>
            <input
              type="text"
              placeholder="¿Qué estás buscando? Ej: Bicicleta, Celular, Sillón..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                padding: '0.8rem 1rem 0.8rem 2.4rem',
                fontSize: '0.95rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--color-text-secondary)' 
              }} 
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto shrink-0">
            <button 
              type="submit"
              className="flex-1 sm:flex-none justify-center"
              style={{
                padding: '0.8rem 1.25rem',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              Buscar
            </button>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 sm:flex-none justify-center"
              style={{
                padding: '0.8rem 1rem',
                backgroundColor: showFilters ? 'var(--color-primary-light)' : 'var(--color-surface)',
                color: showFilters ? '#ffffff' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <SlidersHorizontal size={16} />
              <span>Filtros</span>
            </button>
          </div>
        </form>

        {/* Panel Desplegable de Filtros Avanzados */}
        {showFilters && (
          <div style={{
            marginTop: '1rem',
            padding: '1.25rem',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'flex-end'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Rango de Precio ($)
              </label>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Mín"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    fontSize: '0.85rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)'
                  }}
                />
                <span style={{ color: 'var(--color-text-secondary)' }}>-</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    fontSize: '0.85rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Zona de Jáchal
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '0.85rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)'
                }}
              >
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '0.85rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)'
                }}
              >
                <option value="recent">Más recientes</option>
                <option value="price-asc">Menor precio primero</option>
                <option value="price-desc">Mayor precio primero</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  width: '100%',
                  padding: '7px 12px',
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={14} /> Limpiar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Categorías en Carrusel / Chips */}
      <section className="responsive-container" style={{ paddingTop: '1.25rem', paddingBottom: '0.5rem' }}>
        <div 
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '0.6rem',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: '0.5rem'
          }}
        >
          {CATEGORIES.map((category) => {
            const Icon = category.icon
            const isSelected = (!currentCategory && category.id === 'todos') || (currentCategory === category.id)
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1rem',
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: isSelected ? '#ffffff' : 'var(--color-text)',
                  border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                <Icon size={15} />
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Products Section */}
      <section className="responsive-container" style={{ paddingTop: '1.25rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.15rem, 3.5vw, 1.35rem)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
              {searchParam
                ? `Resultados para "${searchParam}"`
                : currentCategory 
                  ? `Categoría: ${CATEGORIES.find(c => c.id === currentCategory)?.name}` 
                  : 'Publicaciones Recientes'}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'artículo encontrado' : 'artículos encontrados'}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={13} /> Restablecer filtros
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', color: 'var(--color-primary)' }} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1.25rem',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>
              No se encontraron artículos con estos filtros
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              Intenta buscar con otros términos o limpia los filtros activos.
            </p>
            <button
              onClick={handleResetFilters}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="responsive-grid-products">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border)',
        padding: 'clamp(2.25rem, 5vw, 3.5rem) 1rem',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
          ¿Tenés algo para vender en Jáchal?
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem', fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)' }}>
          Publicá tu auto, terreno, teléfono o herramientas en minutos. Es gratis y conectás directo por WhatsApp con compradores reales.
        </p>
        <button
          onClick={() => navigate('/mercado/publicar')}
          style={{
            padding: '0.85rem 1.6rem',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}
        >
          Publicar artículo gratis
        </button>
      </section>
    </div>
  )
}
