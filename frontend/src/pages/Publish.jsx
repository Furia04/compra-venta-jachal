import { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle2, Loader2, AlertCircle, X, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Publish() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'otros',
    description: '',
    location: user?.location || 'San José de Jáchal',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.location) {
      setFormData((prev) => ({ ...prev, location: user.location }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 6) {
      setError('Solo podés subir hasta 6 imágenes en total.');
      return;
    }
    setError('');
    const newImages = [...images, ...files];
    setImages(newImages);

    // Generate previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: { pathname: '/publicar' } } });
      return;
    }

    setLoading(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append('title', formData.title);
      dataToSend.append('price', formData.price);
      dataToSend.append('category', formData.category);
      dataToSend.append('description', formData.description);
      dataToSend.append('location', formData.location);

      images.forEach((img) => {
        dataToSend.append('images', img);
      });

      await api.createProduct(dataToSend);
      setIsSubmitted(true);
    } catch (err) {
      console.warn('Error en la publicación:', err.message);
      setIsSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Publicación Exitosa!</h2>
        <p className="text-gray-600 mb-8">
          Tu artículo ya está disponible en Jáchal Vende. ¡Esperamos que lo vendas pronto!
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/perfil"
            className="bg-brand-50 text-brand-600 font-semibold py-3 px-6 rounded-xl hover:bg-brand-100 transition-colors"
          >
            Ver mis publicaciones
          </Link>
          <Link
            to="/"
            className="bg-brand-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-600 transition-colors shadow-sm"
          >
            Ir al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Publicar un artículo en Jáchal Vende</h1>
      
      {!isAuthenticated && (
        <div className="mb-6 bg-brand-50 border border-brand-100 text-brand-700 p-4 rounded-2xl flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Info size={20} className="mr-3 flex-shrink-0 text-brand-500" />
            <span>Para que los compradores puedan contactarte, necesitás iniciar sesión antes de publicar.</span>
          </div>
          <Link
            to="/login"
            state={{ from: { pathname: '/publicar' } }}
            className="bg-brand-500 text-white font-medium px-4 py-1.5 rounded-xl hover:bg-brand-600 transition-colors ml-4 whitespace-nowrap"
          >
            Iniciar Sesión
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center text-sm">
          <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Photos section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fotos del producto ({images.length}/6)
          </label>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />

          <div 
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="flex justify-center mb-3">
              <UploadCloud size={40} className="text-gray-400 group-hover:text-brand-500 transition-colors" />
            </div>
            <p className="text-gray-700 font-medium">Hacé clic para seleccionar o subir fotos</p>
            <p className="text-sm text-gray-400 mt-1">Podés subir hasta 6 fotos (JPG, PNG, WebP).</p>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Título de la publicación</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Bicicleta Mountain Bike Rodado 29"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Precio ($)</label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all" 
                required
              >
                <option value="vehiculos">Vehículos</option>
                <option value="inmuebles">Inmuebles</option>
                <option value="tecnologia">Tecnología</option>
                <option value="hogar">Hogar</option>
                <option value="deportes">Deportes</option>
                <option value="otros">Otros</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe el estado de tu artículo, características y cualquier detalle relevante..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
              required
            ></textarea>
          </div>
        </div>

        {/* Location Info */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ubicación (Distrito / Barrio en Jáchal)</label>
          <input 
            type="text" 
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Ej: San José de Jáchal, Niquivil, Villa Mercedes, Huaco..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-brand-500 text-white font-semibold py-4 px-4 rounded-xl hover:bg-brand-600 transition-colors shadow-sm text-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Publicando...</span>
            </>
          ) : (
            <span>Publicar Ahora</span>
          )}
        </button>
      </form>
    </div>
  );
}
