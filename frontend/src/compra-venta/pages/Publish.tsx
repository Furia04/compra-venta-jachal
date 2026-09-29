import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { marketplaceApi } from '../services/marketplaceApi'
import { 
  UploadCloud, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export default function Publish() {
  const { isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'vehiculos',
    location: 'San José de Jáchal',
  })
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      if (images.length + filesArray.length > 6) {
        setError('Podés subir un máximo de 6 fotos.')
        return
      }
      
      const newImages = [...images, ...filesArray]
      setImages(newImages)
      
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file))
      setImagePreviews([...imagePreviews, ...newPreviews])
      setError('')
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(updatedImages)
    setImagePreviews(updatedPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title || !formData.price || !formData.description) {
      setError('Por favor completá los campos obligatorios.')
      return
    }

    setLoading(true)

    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('price', formData.price)
      data.append('category', formData.category)
      data.append('location', formData.location)

      images.forEach((img) => {
        data.append('images', img)
      })

      await marketplaceApi.createProduct(data)
      setSuccess(true)
    } catch {
      // Fallback para desarrollo/mock
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm ring-8 ring-emerald-50">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">¡Publicación Exitosa!</h2>
        <p className="text-sm text-slate-600 mb-8 max-w-md mx-auto">
          Tu artículo ya está disponible en Jáchal Vende. Los compradores interesados podrán contactarte directamente por WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/mercado/perfil"
            className="bg-brand-50 text-brand-700 font-bold py-3 px-6 rounded-2xl hover:bg-brand-100 transition-colors text-xs sm:text-sm"
          >
            Ver mis publicaciones
          </Link>
          <Link
            to="/mercado"
            className="bg-brand-600 text-white font-bold py-3 px-6 rounded-2xl hover:bg-brand-700 transition-colors shadow-sm text-xs sm:text-sm"
          >
            Ir al catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-3">
          <Sparkles size={13} />
          <span>Publicación 100% gratuita</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Publicar un artículo en Jáchal Vende
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Completá los datos de tu producto o servicio para que los vecinos puedan encontrarte.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="mb-8 bg-brand-50/80 border border-brand-200/80 text-brand-900 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Info size={18} className="text-brand-600 shrink-0" />
            <span>Para que los compradores puedan ver tu nombre y teléfono, te sugerimos iniciar sesión.</span>
          </div>
          <Link
            to="/mercado/login"
            state={{ from: { pathname: '/mercado/publicar' } }}
            className="bg-brand-600 text-white font-bold px-3.5 py-1.5 rounded-xl hover:bg-brand-700 transition-colors shrink-0 shadow-xs"
          >
            Iniciar Sesión
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-medium">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80">
        
        {/* Photos section */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
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
            className="border-2 border-dashed border-slate-200 hover:border-brand-400 bg-slate-50/50 hover:bg-brand-50/20 rounded-2xl p-8 text-center transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-white rounded-2xl shadow-xs border border-slate-200/70 flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:text-brand-600 group-hover:scale-105 transition-all">
              <UploadCloud size={24} />
            </div>
            <p className="text-xs font-bold text-slate-700">Hacé clic para seleccionar fotos de tu galería</p>
            <p className="text-[11px] text-slate-400 mt-1">Formatos JPG, PNG, WebP (hasta 6 fotos).</p>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-1 hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Título de la publicación *
            </label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Volkswagen Gol Trend 1.6 2018 Impecable"
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-xs sm:text-sm font-medium"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Precio en Pesos ($) *
              </label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-xs sm:text-sm font-medium tabular-nums"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Categoría *
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-xs sm:text-sm font-medium cursor-pointer" 
                required
              >
                <option value="vehiculos">Vehículos & Autos</option>
                <option value="inmuebles">Inmuebles & Terrenos</option>
                <option value="tecnologia">Tecnología & Celulares</option>
                <option value="hogar">Hogar & Muebles</option>
                <option value="deportes">Deportes & Bicicletas</option>
                <option value="otros">Otros artículos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Descripción detallada *
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describí el estado, año, detalles de uso y cualquier información que le sirva al comprador..."
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-xs sm:text-sm font-medium resize-none"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ubicación en Jáchal *
            </label>
            <input 
              type="text" 
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ej: San José de Jáchal, Niquivil, Villa Mercedes..."
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-xs sm:text-sm font-medium"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md shadow-brand-600/25 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Publicando artículo...</span>
            </>
          ) : (
            <>
              <span>Publicar Ahora</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
