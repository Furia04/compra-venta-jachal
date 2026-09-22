import { Heart, MapPin, Clock, ShieldCheck, Share2 } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();

  // Mock product data to display
  const product = {
    title: 'Volkswagen Gol Trend 1.6 2018',
    price: 8500000,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    location: 'Centro, Jáchal, San Juan',
    date: 'Publicado hace 2 horas',
    description: 'Excelente estado, único dueño. Papeles al día, listo para transferir. Mantenimiento al día con cambio de aceite reciente. Rueda de auxilio sin rodar. Se puede pasar a ver por el centro de Jáchal previa coordinación.',
    seller: {
      name: 'Juan Pérez',
      rating: 4.8,
      memberSince: '2023',
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-brand-500">Inicio</Link> &gt; 
        <span className="mx-2">Vehículos</span> &gt; 
        <span className="mx-2 text-gray-800">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Image and Description */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-8 relative group">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-auto object-cover aspect-video"
            />
            <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-accent-500 hover:bg-white transition-colors shadow-sm">
              <Heart size={24} />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Descripción</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>

        {/* Right Column: Price and Seller Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              ${product.price.toLocaleString('es-AR')}
            </div>
            <h1 className="text-xl font-medium text-gray-800 mb-6 leading-snug">
              {product.title}
            </h1>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin size={18} className="mr-2 text-brand-500" />
                {product.location}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Clock size={18} className="mr-2 text-brand-500" />
                {product.date}
              </div>
            </div>

            <button className="w-full bg-brand-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-brand-600 transition-colors shadow-sm mb-3">
              Contactar al vendedor
            </button>
            <button className="w-full bg-brand-50 text-brand-600 font-semibold py-3 px-4 rounded-xl hover:bg-brand-100 transition-colors flex justify-center items-center">
              <Share2 size={18} className="mr-2" />
              Compartir publicación
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Información del vendedor</h3>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold text-xl mr-4">
                {product.seller.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{product.seller.name}</p>
                <p className="text-sm text-gray-500">Miembro desde {product.seller.memberSince}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <ShieldCheck size={18} className="text-green-600 mr-2" />
              Identidad verificada
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
