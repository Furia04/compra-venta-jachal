import ProductCard from '../components/ProductCard';
import { Car, Home as HomeIcon, Smartphone, Sofa, Bike } from 'lucide-react';

const CATEGORIES = [
  { name: 'Vehículos', icon: Car },
  { name: 'Inmuebles', icon: HomeIcon },
  { name: 'Tecnología', icon: Smartphone },
  { name: 'Hogar', icon: Sofa },
  { name: 'Deportes', icon: Bike },
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    title: 'Volkswagen Gol Trend 1.6 2018',
    price: 8500000,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400',
    location: 'Centro, Jáchal',
    date: 'Hoy'
  },
  {
    id: 2,
    title: 'iPhone 13 Pro Max 256gb Libre Impecable',
    price: 950000,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=400',
    location: 'San José de Jáchal',
    date: 'Ayer'
  },
  {
    id: 3,
    title: 'Bicicleta Mountain Bike Venzo Rodado 29',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400',
    location: 'Niquivil',
    date: 'Hace 2 días'
  },
  {
    id: 4,
    title: 'Sillón 3 Cuerpos Chenille',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=400',
    location: 'Centro, Jáchal',
    date: 'Hoy'
  }
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Categorías Populares</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            return (
              <button 
                key={index}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-brand-500 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-3 group-hover:bg-brand-500 transition-colors">
                  <Icon className="text-brand-500 group-hover:text-white" size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-brand-500">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent Listings */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recién Publicados</h2>
          <button className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Ver todos &rarr;
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

    </div>
  );
}
