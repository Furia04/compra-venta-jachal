import { Link } from 'react-router-dom'
import type { Product } from '../types/product'

interface ProductCardProps {
  product?: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) return null

  const productId = product._id || product.id || '1'
  const productTitle = product.title || 'Producto sin título'
  const productPrice = Number(product.price) || 0
  const productImage = product.images?.[0]?.url || product.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400'
  const productLocation = product.location || 'Jáchal'

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
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
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-md)',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--color-text)', margin: 0 }}>
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
            textDecoration: 'none'
          }}
        >
          Ver producto
        </Link>
      </div>
    </div>
  )
}
