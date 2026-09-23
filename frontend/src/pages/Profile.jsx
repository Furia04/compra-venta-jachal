import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { User, Phone, Mail, MapPin, Trash2, LogOut, PlusCircle, Loader2, Package } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadMyListings() {
      try {
        const data = await api.getMyListings();
        setMyListings(data || []);
      } catch (err) {
        console.warn('Error cargando publicaciones del usuario:', err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMyListings();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta publicación?')) return;
    try {
      await api.deleteProduct(id);
      setMyListings(myListings.filter((item) => item._id !== id));
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* User Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center font-extrabold text-3xl shadow-inner flex-shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center">
                <Mail size={16} className="mr-1.5 text-brand-500" />
                {user.email}
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-1.5 text-brand-500" />
                {user.phone}
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-1.5 text-brand-500" />
                {user.location || 'Jáchal'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Link
            to="/publicar"
            className="flex-1 md:flex-none inline-flex items-center justify-center bg-brand-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-brand-600 transition-colors shadow-sm text-sm"
          >
            <PlusCircle size={18} className="mr-2" />
            Nueva Publicación
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center bg-red-50 text-red-600 px-4 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors text-sm cursor-pointer"
          >
            <LogOut size={18} className="mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* My Listings Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Package size={22} className="mr-2 text-brand-500" />
            Mis Publicaciones Activas ({myListings.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-brand-500" size={36} />
          </div>
        ) : myListings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No tienes artículos publicados</h3>
            <p className="text-gray-500 text-sm mb-6">
              ¡Comenzá a vender lo que ya no usás en la comunidad de Jáchal!
            </p>
            <Link
              to="/publicar"
              className="inline-flex items-center bg-brand-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-600 transition-colors text-sm shadow-sm"
            >
              <PlusCircle size={18} className="mr-2" />
              Publicar mi primer artículo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myListings.map((product) => (
              <div key={product._id} className="relative group">
                <ProductCard product={product} />
                <button
                  onClick={() => handleDelete(product._id)}
                  title="Eliminar publicación"
                  className="absolute top-3 left-3 p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors cursor-pointer z-10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
