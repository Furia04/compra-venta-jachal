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
  Loader2 
} from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="animate-spin mb-3 text-brand-500" size={40} />
        <p>Cargando información del producto...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Publicación no encontrada</h2>
        <p className="text-gray-500 mb-8">El artículo que estás buscando no existe o ya fue retirado.</p>
        <Link to="/mercado" className="bg-brand-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-600 transition-colors">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const seller = product.user || {
    name: 'Vendedor Particular',
    phone: '2645000000',
    location: product.location || 'Jáchal',
    isVerified: false,
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
          text: `Mira esta publicación en Jáchal Vende: ${product.title} - $${Number(product.price).toLocaleString('es-AR')}`,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Back button & Breadcrumb */}
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/mercado" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-500">
          <ArrowLeft size={16} className="mr-1" />
          Volver al catálogo
        </Link>
        <span className="text-gray-300">|</span>
        <span className="text-sm text-gray-500 capitalize">{product.category || 'General'}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Image and Description */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
            <img 
              src={mainImage} 
              alt={product.title} 
              className="w-full h-auto max-h-[500px] object-cover"
            />
            <button 
              aria-label="Guardar en favoritos"
              className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-accent-500 hover:bg-white transition-colors shadow-sm cursor-pointer"
            >
              <Heart size={24} />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción del artículo</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-base">
              {product.description || 'Sin descripción adicional.'}
            </p>
          </div>
        </div>

        {/* Right Column: Price and Seller Contact */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <div className="text-3xl font-extrabold text-gray-900 mb-2">
              ${Number(product.price).toLocaleString('es-AR')}
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-6 leading-snug">
              {product.title}
            </h1>
            
            <div className="space-y-3 mb-8 text-sm">
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-2 text-brand-500 flex-shrink-0" />
                <span>{product.location || 'Jáchal, San Juan'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={18} className="mr-2 text-brand-500 flex-shrink-0" />
                <span>
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString('es-AR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'Publicado recientemente'}
                </span>
              </div>
            </div>

            {/* WhatsApp Contact Action */}
            <a 
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 text-base mb-3 cursor-pointer"
            >
              <MessageCircle size={22} />
              <span>Contactar por WhatsApp</span>
            </a>

            {/* Share Action */}
            <button 
              onClick={handleShare}
              className="w-full bg-brand-50 text-brand-600 hover:bg-brand-100 font-semibold py-3 px-4 rounded-xl transition-colors flex justify-center items-center cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={18} className="mr-2 text-green-600" />
                  <span className="text-green-600">¡Enlace copiado!</span>
                </>
              ) : (
                <>
                  <Share2 size={18} className="mr-2" />
                  <span>Compartir publicación</span>
                </>
              )}
            </button>
          </div>

          {/* Seller Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Información del vendedor
            </h3>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                {(seller.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{seller.name}</p>
                <p className="text-xs text-gray-500">{seller.location || 'Jáchal'}</p>
              </div>
            </div>
            
            {seller.isVerified ? (
              <div className="flex items-center text-xs text-green-700 bg-green-50 p-3 rounded-xl">
                <ShieldCheck size={18} className="text-green-600 mr-2 flex-shrink-0" />
                <span>Identidad verificada en la comunidad</span>
              </div>
            ) : (
              <div className="flex items-center text-xs text-gray-600 bg-gray-50 p-3 rounded-xl">
                <ShieldCheck size={18} className="text-brand-500 mr-2 flex-shrink-0" />
                <span>Vendedor verificado por número telefónico</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
