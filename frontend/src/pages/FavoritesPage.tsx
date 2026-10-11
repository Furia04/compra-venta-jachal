import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Wrench, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import WorkerCard from '../components/WorkerCard/WorkerCard'
import ProductCard from '../compra-venta/components/ProductCard'

export default function FavoritesPage() {
  const { favoriteWorkers, favoriteProducts } = useFavorites()
  const [activeTab, setActiveTab] = useState<'workers' | 'products'>(
    favoriteWorkers.length > 0 ? 'workers' : (favoriteProducts.length > 0 ? 'products' : 'workers')
  )

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: '75vh' }}>
      {/* Volver */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: 'var(--color-primary)', 
            textDecoration: 'none', 
            fontWeight: 600, 
            fontSize: '0.9rem' 
          }}
        >
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          backgroundColor: '#FFE4E6',
          color: '#E11D48',
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Heart size={24} className="fill-current" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            Mis Favoritos y Guardados
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
            Acceso rápido a los profesionales de confianza y artículos de tu interés en Jáchal.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid var(--color-border)',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('workers')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: `3px solid ${activeTab === 'workers' ? 'var(--color-primary)' : 'transparent'}`,
            color: activeTab === 'workers' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: activeTab === 'workers' ? 700 : 500,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
            transition: 'all 0.2s'
          }}
        >
          <Wrench size={16} />
          <span>Profesionales de Oficios ({favoriteWorkers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: `3px solid ${activeTab === 'products' ? 'var(--color-primary)' : 'transparent'}`,
            color: activeTab === 'products' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: activeTab === 'products' ? 700 : 500,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
            transition: 'all 0.2s'
          }}
        >
          <ShoppingBag size={16} />
          <span>Artículos del Mercado ({favoriteProducts.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'workers' ? (
        favoriteWorkers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-secondary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Wrench size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
              No tenés trabajadores guardados todavía
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Explorá electricistas, plomeros, albañiles o técnicos y guardá los perfiles que más te interesen haciendo clic en el corazón.
            </p>
            <Link
              to="/buscar"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <Sparkles size={16} />
              Explorar directorio de oficios
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {favoriteWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        )
      ) : (
        favoriteProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-secondary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <ShoppingBag size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
              No tenés artículos guardados todavía
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Encontrá vehículos, muebles, celulares y herramientas en Jáchal Vende y guardalos para revisarlos más tarde.
            </p>
            <Link
              to="/mercado"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <Sparkles size={16} />
              Explorar publicaciones del mercado
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {favoriteProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )
      )}
    </div>
  )
}
