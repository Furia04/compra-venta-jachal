import { useState } from 'react';
import { Search, User, Menu, LogIn, LogOut, Package, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-extrabold text-brand-500 tracking-tight">
              Jáchal Vende
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos, autos, herramientas en Jáchal..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-brand-500 cursor-pointer">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link 
              to="/publicar" 
              className="bg-brand-500 text-white px-4 py-2 rounded-xl hover:bg-brand-600 font-medium transition-colors shadow-sm text-sm"
            >
              Publicar gratis
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      to="/perfil"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600"
                    >
                      <UserCircle size={16} className="mr-2.5" />
                      Mi Perfil
                    </Link>
                    <Link
                      to="/perfil"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600"
                    >
                      <Package size={16} className="mr-2.5" />
                      Mis Publicaciones
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut size={16} className="mr-2.5" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-brand-500 font-medium px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center"
                >
                  <LogIn size={16} className="mr-1.5" />
                  Ingresar
                </Link>
                <Link
                  to="/registro"
                  className="border border-brand-500 text-brand-500 hover:bg-brand-50 font-medium px-3 py-2 rounded-xl transition-colors text-sm"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600 hover:text-brand-500 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-100 py-4 space-y-3">
            <Link
              to="/publicar"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center bg-brand-500 text-white py-2.5 rounded-xl font-semibold text-sm"
            >
              Publicar gratis
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/perfil"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-lg text-sm"
                >
                  Mi Perfil ({user?.name})
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="block w-full text-left px-3 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg text-sm"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
                >
                  Ingresar
                </Link>
                <Link
                  to="/registro"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2 bg-brand-50 text-brand-600 rounded-xl text-sm font-semibold"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </nav>
  );
}
