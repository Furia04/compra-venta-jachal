import { useState } from 'react'
import { Search, Menu, X, LogIn, LogOut, Package, UserCircle, Wrench, Plus, ShoppingBag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/mercado?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      navigate('/mercado')
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Emprendimientos Switcher */}
          <div className="flex items-center gap-5">
            <Link 
              to="/mercado" 
              className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
                <ShoppingBag size={18} />
              </div>
              <span>
                Jáchal<span className="text-purple-600">Vende</span>
              </span>
            </Link>

            {/* Switcher entre emprendimientos (Segmented control) */}
            <div className="hidden lg:inline-flex items-center p-1 bg-slate-100/90 rounded-xl text-xs font-semibold border border-slate-200/60">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Wrench size={13} className="text-blue-600" />
                Oficios & Servicios
              </Link>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-purple-700 shadow-xs border border-slate-200/50">
                <ShoppingBag size={13} className="text-purple-600" />
                Compra & Venta
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-2">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar autos, teléfonos, herramientas en Jáchal..."
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all text-sm placeholder:text-slate-400"
              />
              <button 
                type="submit" 
                aria-label="Buscar"
                className="absolute right-2.5 top-2 p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Switcher link */}
            <Link
              to="/"
              className="lg:hidden inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Wrench size={13} className="text-blue-600" />
              <span className="hidden sm:inline">Oficios</span>
            </Link>

            <Link 
              to="/mercado/publicar" 
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3.5 sm:px-4 py-2 rounded-xl font-semibold transition-all shadow-sm shadow-purple-500/25 hover:shadow-md hover:shadow-purple-500/30 hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm cursor-pointer"
            >
              <Plus size={16} />
              <span>Publicar</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ring-2 ring-purple-500/20">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-700 max-w-[90px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/mercado/perfil"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      <UserCircle size={15} className="mr-2 text-purple-600" />
                      Mi Perfil
                    </Link>
                    <Link
                      to="/mercado/perfil"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      <Package size={15} className="mr-2 text-purple-600" />
                      Mis Publicaciones
                    </Link>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        logout()
                        navigate('/mercado')
                      }}
                      className="w-full flex items-center px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut size={15} className="mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/mercado/login"
                  className="text-slate-700 hover:text-purple-600 font-semibold px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-xs flex items-center gap-1"
                >
                  <LogIn size={15} />
                  Ingresar
                </Link>
                <Link
                  to="/mercado/registro"
                  className="border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 hover:bg-purple-50/50 font-semibold px-3 py-2 rounded-xl transition-colors text-xs"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú móvil"
              className="sm:hidden p-2 text-slate-600 hover:text-purple-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown & Search */}
        {menuOpen && (
          <div className="sm:hidden border-t border-slate-100 py-4 space-y-3">
            <form onSubmit={handleSearch} className="w-full mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar en Jáchal..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-10 text-xs"
                />
                <button type="submit" className="absolute right-2.5 top-2 text-slate-400">
                  <Search size={15} />
                </button>
              </div>
            </form>

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 text-blue-800 font-semibold text-xs"
            >
              <Wrench size={15} className="text-blue-600" />
              <span>Ir a Oficios & Servicios</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/mercado/perfil"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-slate-700 font-semibold hover:bg-slate-50 rounded-xl text-xs"
                >
                  Mi Perfil ({user?.name})
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    logout()
                    navigate('/mercado')
                  }}
                  className="block w-full text-left px-3 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-xl text-xs"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/mercado/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  Ingresar
                </Link>
                <Link
                  to="/mercado/registro"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2.5 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  )
}
