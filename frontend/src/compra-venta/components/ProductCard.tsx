import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import type { Product } from '../types/product'
import { useFavorites } from '../../context/FavoritesContext'

interface ProductCardProps {
  product?: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isProductFavorite, toggleProductFavorite } = useFavorites()

  if (!product) return null

  const productId = product._id || product.id || '1'
  const productTitle = product.title || 'Producto sin título'
  const productPrice = Number(product.price) || 0
  const productImage = product.images?.[0]?.url || product.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400'
  const productLocation = product.location || 'Jáchal'
  const isFav = isProductFavorite(productId)

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s'
    }}>
      <img 
        src={productImage} 
        alt={productTitle} 
        style={{
          width: '100%',
          height: '160px',
          objectFit: 'cover'
        }}
      />

      {/* Botón Flotante de Favorito */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          toggleProductFavorite(product)
        }}
        aria-label={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isFav ? '#E11D48' : '#64748B',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.2s',
          zIndex: 10
        }}
      >
        <Heart size={18} className={isFav ? 'fill-current' : ''} />
      </button>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-md)',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--color-text)', margin: 0, fontWeight: 700 }}>
          {productTitle}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          {productLocation}
        </p>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '0.5rem' }}>
          ${productPrice.toLocaleString('es-AR')}
        </div>
        
        <Link 
          to={`/mercado/producto/${productId}`}
          style={{
            marginTop: '1rem',
            padding: 'var(--spacing-sm) var(--spacing-lg)',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 600,
            width: '100%',
            textAlign: 'center',
            textDecoration: 'none',
            boxSizing: 'border-box'
          }}
        >
          Ver producto
        </Link>
      </div>
    </div>
  )
}
