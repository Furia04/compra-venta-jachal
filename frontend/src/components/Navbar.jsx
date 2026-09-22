import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-brand-500">
              Jáchal Vende
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar productos, vehículos, inmuebles..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
              <button className="absolute right-3 top-2.5 text-gray-400 hover:text-brand-500">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link to="/publicar" className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 font-medium transition-colors shadow-sm">
              Publicar gratis
            </Link>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-brand-500 hover:bg-brand-50 rounded-full transition-colors">
                <User size={24} />
              </button>
              <button className="p-2 text-gray-600 hover:text-brand-500 hover:bg-brand-50 rounded-full transition-colors">
                <ShoppingCart size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center">
            <button className="p-2 text-gray-600">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
