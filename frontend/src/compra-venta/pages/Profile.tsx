import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { marketplaceApi } from '../services/marketplaceApi'
import type { Product } from '../types/product'
import { Phone, Mail, MapPin, Trash2, LogOut, PlusCircle, Loader2, Package, Sparkles } from 'lucide-react'
import ProductCard from '../components/ProductCard'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [myListings, setMyListings] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/mercado/login')
      return
    }

    async function loadMyListings() {
      try {
        const data = await marketplaceApi.getMyListings()
        setMyListings(data || [])
      } catch (err) {
        console.warn('Error cargando publicaciones del usuario:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMyListings()
  }, [user, navigate])

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta publicación?')) return
    try {
      await marketplaceApi.deleteProduct(id)
      setMyListings(myListings.filter((item) => item._id !== id))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar'
      alert(`Error al eliminar: ${msg}`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/mercado')
  }

  if (!user) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* User Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-3xl flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md shadow-purple-500/20 shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
              <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-100">
                Vecino Jáchal
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1">
                <Mail size={14} className="text-purple-600" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-1">
                  <Phone size={14} className="text-purple-600" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-purple-600" />
                <span>{user.location || 'Jáchal, San Juan'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            to="/mercado/publicar"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-xs text-xs sm:text-sm"
          >
            <PlusCircle size={16} />
            <span>Nueva Publicación</span>
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 px-4 py-2.5 rounded-xl font-semibold transition-colors text-xs sm:text-sm cursor-pointer border border-slate-200/60"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* My Listings Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package size={20} className="text-purple-600" />
            <span>Mis Publicaciones ({myListings.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 bg-white rounded-3xl border border-slate-200/80">
            <Loader2 className="animate-spin text-purple-600" size={32} />
          </div>
        ) : myListings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No tenés publicaciones activas</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              ¡Comenzá a vender lo que ya no usás en la comunidad de Jáchal hoy mismo!
            </p>
            <Link
              to="/mercado/publicar"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition-colors text-xs shadow-xs"
            >
              <PlusCircle size={16} />
              <span>Publicar mi primer artículo</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {myListings.map((product) => (
              <div key={product._id} className="relative group">
                <ProductCard product={product} />
                <button
                  onClick={() => handleDelete(product._id)}
                  title="Eliminar publicación"
                  className="absolute top-2.5 left-2.5 p-2 bg-white/90 hover:bg-rose-600 text-slate-600 hover:text-white rounded-full shadow-md backdrop-blur-md transition-colors cursor-pointer z-10"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
