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

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

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
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const mainImage = product.images?.[0]?.url || product.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
        <Link to="/mercado" className="inline-flex items-center gap-1 hover:text-brand-700 transition-colors">
          <ArrowLeft size={14} />
          <span>Volver a Jáchal Vende</span>
        </Link>
        <span className="text-slate-300">/</span>
        <span className="capitalize text-slate-700">{product.category || 'Artículos'}</span>
        <span className="text-slate-300">/</span>
        <span className="truncate max-w-[200px] text-slate-400">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Images + Description) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Product Image Card */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] relative group">
            <div className="aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-100 flex items-center justify-center overflow-hidden">
              <img 
                src={mainImage} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 ease-out"
              />
            </div>

            {/* Favorite Floating Button */}
            <button 
              onClick={() => setIsLiked(!isLiked)}
              aria-label="Guardar en favoritos"
              className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all shadow-md cursor-pointer ${
                isLiked 
                  ? 'bg-rose-500 text-white scale-105' 
                  : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
              }`}
            >
              <Heart size={20} className={isLiked ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-brand-600" />
              Descripción del artículo
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line text-pretty">
              {product.description || 'Sin descripción adicional proporcionada por el vendedor.'}
            </p>
          </div>
        </div>

        {/* Right Column (Price, Actions, Seller) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Price & Contact Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
            <div className="flex items-baseline gap-1 text-slate-900 mb-2">
              <span className="text-lg font-bold text-brand-600">$</span>
              <span className="text-3xl sm:text-4xl font-black tracking-tight tabular-nums">
                {Number(product.price).toLocaleString('es-AR')}
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-bold text-slate-900 mb-4 leading-snug">
              {product.title}
            </h1>

            <div className="space-y-2 pb-6 border-b border-slate-100 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-brand-600 shrink-0" />
                <span>{product.location || 'Jáchal, San Juan'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-brand-600 shrink-0" />
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
            <div className="pt-6 space-y-3">
              <a 
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <MessageCircle size={20} />
                <span>Contactar por WhatsApp</span>
              </a>

              {seller.phone && (
                <a
                  href={`tel:${seller.phone}`}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs border border-slate-200/70"
                >
                  <PhoneCall size={15} />
                  <span>Llamar al vendedor</span>
                </a>
              )}

              <button 
                onClick={handleShare}
                className="w-full bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-600" />
                    <span className="text-emerald-600 font-bold">¡Enlace copiado al portapapeles!</span>
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
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Vendedor
            </h3>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-brand-100 text-brand-700 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 ring-2 ring-brand-500/10">
                {(seller.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{seller.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{seller.location || 'Jáchal'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl font-medium">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>Vecino verificado de la comunidad</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
