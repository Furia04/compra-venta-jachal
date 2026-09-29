import { Heart } from 'lucide-react'
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
  
  const displayDate = p.createdAt 
    ? new Date(p.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
    : (p.date || 'Reciente')

  return (
    <Link 
      to={`/mercado/producto/${productId}`} 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer block"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={productImage} 
          alt={productTitle} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <button 
          onClick={(e) => { 
            e.preventDefault()
          }}
          aria-label="Guardar en favoritos"
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-accent-500 hover:bg-white transition-colors"
        >
          <Heart size={18} />
        </button>
      </div>
      <div className="p-4">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          ${productPrice.toLocaleString('es-AR')}
        </div>
        <h3 className="text-sm text-gray-600 font-medium line-clamp-2 h-10 mb-2">
          {productTitle}
        </h3>
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>{productLocation}</span>
          <span>{displayDate}</span>
        </div>
      </div>
    </Link>
  )
}
