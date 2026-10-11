import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { marketplaceApi, FALLBACK_PRODUCTS } from '../services/marketplaceApi'
import type { Product } from '../types/product'
import { 
  Heart, 
  MapPin, 
  Clock, 
  Share2, 
  MessageCircle, 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  Loader2,
  PhoneCall,
  Sparkles
} from 'lucide-react'

import { useFavorites } from '../../context/FavoritesContext'
import { useToast } from '../../context/ToastContext'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const { isProductFavorite, toggleProductFavorite } = useFavorites()
  const { showSuccess } = useToast()

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return
      setLoading(true)
      try {
        const data = await marketplaceApi.getProductById(id)
        if (data && data._id) {
          setProduct(data)
        } else {
          setProduct(FALLBACK_PRODUCTS[0])
        }
      } catch (err) {
        console.warn('Detalle de API no encontrado, cargando datos de muestra:', err)
        setProduct(FALLBACK_PRODUCTS[0])
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-slate-400">
        <Loader2 className="animate-spin mb-3 text-brand-600" size={36} />
        <p className="text-xs font-semibold text-slate-500">Cargando publicación...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <ArrowLeft size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Publicación no encontrada</h2>
        <p className="text-xs text-slate-500 mb-6">El artículo que estás buscando no existe o ya fue retirado.</p>
        <Link 
          to="/mercado" 
          className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-brand-700 transition-colors shadow-xs"
        >
          <ArrowLeft size={15} />
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const seller = product.user || {
    name: 'Vendedor Particular',
    phone: '2645000000',
    location: product.location || 'Jáchal',
    isVerified: true,
  }

  const cleanPhone = (seller.phone || '').replace(/\D/g, '')
  const waMessage = encodeURIComponent(
    `Hola ${seller.name}! Te contacto desde Jáchal Vende por tu publicación: "${product.title}" (${window.location.href}). ¿Sigue disponible?`
  )
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waMessage}` : '#'

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Mirá esta publicación en Jáchal Vende: ${product.title} - $${Number(product.price).toLocaleString('es-AR')}`,
          url: window.location.href,
        })
      } catch {
        // Cancelado
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      showSuccess('¡Enlace de la publicación copiado al portapapeles!')
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const isFav = isProductFavorite(product._id || product.id || '')

  const mainImage = product.images?.[0]?.url || product.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
        <Link to="/mercado" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Volver a Jáchal Vende</span>
        </Link>
        <span>/</span>
        <span style={{ textTransform: 'capitalize', color: 'var(--color-text)' }}>{product.category || 'Artículos'}</span>
        <span>/</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>{product.title}</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* Left Column (Images + Description) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Main Product Image Card */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            position: 'relative'
          }}>
            <div style={{
              width: '100%',
              maxHeight: '440px',
              backgroundColor: 'var(--color-bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img 
                src={mainImage} 
                alt={product.title} 
                style={{
                  width: '100%',
                  maxHeight: '440px',
                  objectFit: 'contain',
                  backgroundColor: '#0f172a'
                }}
              />
            </div>

            {/* Favorite Floating Button */}
            <button 
              onClick={() => toggleProductFavorite(product)}
              aria-label="Guardar en favoritos"
              title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.65rem',
                borderRadius: '50%',
                backgroundColor: isFav ? '#e11d48' : 'rgba(255, 255, 255, 0.95)',
                color: isFav ? '#ffffff' : '#64748b',
                border: 'none',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s'
              }}
            >
              <Heart size={20} className={isFav ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Description Card */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
              Descripción del artículo
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>
              {product.description || 'Sin descripción adicional proporcionada por el vendedor.'}
            </p>
          </div>
        </div>

        {/* Right Column (Price, Actions, Seller) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Price & Contact Box */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>$</span>
              <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>
                {Number(product.price).toLocaleString('es-AR')}
              </span>
            </div>

            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
              {product.title}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <span>{product.location || 'Jáchal, San Juan'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <span>
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString('es-AR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'Publicado recientemente'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a 
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  fontWeight: 700,
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.95rem',
                  boxShadow: '0 2px 6px rgba(37, 211, 102, 0.25)',
                  boxSizing: 'border-box'
                }}
              >
                <MessageCircle size={20} />
                <span>Contactar por WhatsApp</span>
              </a>

              {seller.phone && (
                <a
                  href={`tel:${seller.phone}`}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text)',
                    fontWeight: 600,
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    border: '1px solid var(--color-border)',
                    boxSizing: 'border-box'
                  }}
                >
                  <PhoneCall size={16} />
                  <span>Llamar al vendedor</span>
                </a>
              )}

              <button 
                onClick={handleShare}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(27, 73, 101, 0.08)',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                {copied ? (
                  <>
                    <Check size={16} style={{ color: '#059669' }} />
                    <span style={{ color: '#059669', fontWeight: 700 }}>¡Enlace copiado al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={16} />
                    <span>Compartir publicación</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Seller Card */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Vendedor
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: 'rgba(27, 73, 101, 0.1)',
                color: 'var(--color-primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.1rem',
                flexShrink: 0
              }}>
                {(seller.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {seller.name}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {seller.location || 'Jáchal'}
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: '#065f46',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '0.65rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600
            }}>
              <ShieldCheck size={18} style={{ color: '#059669', flexShrink: 0 }} />
              <span>Vecino verificado de la comunidad</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
