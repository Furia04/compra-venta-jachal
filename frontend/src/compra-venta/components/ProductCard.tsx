import { useState } from 'react'
import { Heart, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../types/product'

interface ProductCardProps {
  product?: Product
  id?: string
  title?: string
  price?: number
  image?: string
  location?: string
  date?: string
}

export default function ProductCard({ product, id, title, price, image, location, date }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  const p = product || {
    _id: id || '1',
    title: title || 'Producto sin título',
    price: price || 0,
    image,
    location: location || 'Jáchal',
    date
  }
  
  const productId = p._id || p.id || '1'
  const productTitle = p.title || 'Producto sin título'
  const productPrice = Number(p.price) || 0
  const productImage = p.images?.[0]?.url || p.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400'
  const productLocation = p.location || 'Jáchal'
  const categoryLabel = p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : null
  
  const displayDate = p.createdAt 
    ? new Date(p.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
    : (p.date || 'Reciente')

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <Link 
      to={`/mercado/producto/${productId}`} 
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] hover:border-slate-300 hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img 
          src={productImage} 
          alt={productTitle} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-t-2xl pointer-events-none" />

        {/* Favorite Button */}
        <button 
          onClick={toggleFavorite}
          aria-label={isLiked ? "Quitar de favoritos" : "Guardar en favoritos"}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-150 cursor-pointer ${
            isLiked 
              ? 'bg-rose-500 text-white shadow-sm scale-105' 
              : 'bg-white/85 text-slate-600 hover:text-rose-500 hover:bg-white shadow-xs'
          }`}
        >
          <Heart size={16} className={isLiked ? 'fill-current' : ''} />
        </button>

        {/* Category Badge */}
        {categoryLabel && (
          <div className="absolute bottom-2.5 left-2.5 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            <Sparkles size={10} className="text-amber-300" />
            {categoryLabel}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline gap-1 text-slate-900 mb-1">
            <span className="text-sm font-bold text-brand-600">$</span>
            <span className="text-xl sm:text-2xl font-black tracking-tight tabular-nums">
              {productPrice.toLocaleString('es-AR')}
            </span>
          </div>
          
          <h3 className="text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug mb-3">
            {productTitle}
          </h3>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1 truncate max-w-[65%]">
            <MapPin size={12} className="text-slate-400 shrink-0" />
            <span className="truncate">{productLocation}</span>
          </span>
          <span className="shrink-0">{displayDate}</span>
        </div>
      </div>
    </Link>
  )
}
