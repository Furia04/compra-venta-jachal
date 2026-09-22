import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ id, title, price, image, location, date }) {
  return (
    <Link to={`/producto/${id || 1}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer block">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button 
          onClick={(e) => { e.preventDefault(); /* Add to favorites logic here */ }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-accent-500 hover:bg-white transition-colors"
        >
          <Heart size={18} />
        </button>
      </div>
      <div className="p-4">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          ${price.toLocaleString('es-AR')}
        </div>
        <h3 className="text-sm text-gray-600 font-medium line-clamp-2 h-10 mb-2">
          {title}
        </h3>
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>{location}</span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
}
