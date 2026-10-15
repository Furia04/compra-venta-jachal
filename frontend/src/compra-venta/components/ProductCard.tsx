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
      transition: 'box-shadow 0.2s',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ position: 'relative', width: '100%', height: '170px', backgroundColor: 'var(--color-bg-secondary)', overflow: 'hidden' }}>
        <img 
          src={productImage} 
          alt={productTitle} 
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
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
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
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
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: 'var(--spacing-xs)',
        padding: '1rem',
        textAlign: 'left'
      }}>
        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>
          ${productPrice.toLocaleString('es-AR')}
        </div>
        <h3 style={{ 
          fontSize: '0.95rem', 
          color: 'var(--color-text)', 
          margin: '0.2rem 0 0', 
          fontWeight: 600,
          lineHeight: 1.35,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.6rem'
        }}>
          {productTitle}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 'auto 0 0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>📍</span> {productLocation}
        </p>
        
        <Link 
          to={`/mercado/producto/${productId}`}
          style={{
            marginTop: 'auto',
            padding: '0.65rem 1rem',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 600,
            width: '100%',
            textAlign: 'center',
            textDecoration: 'none',
            boxSizing: 'border-box',
            display: 'block'
          }}
        >
          Ver producto
        </Link>
      </div>
    </div>
  )
}
