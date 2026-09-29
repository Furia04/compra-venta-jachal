import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { marketplaceApi } from '../services/marketplaceApi'

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
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>¡Publicación Exitosa!</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          Tu artículo ya está disponible. Los compradores interesados podrán contactarte directamente por WhatsApp.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link
            to="/mercado/perfil"
            style={{ padding: 'var(--spacing-sm) var(--spacing-lg)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontWeight: 600 }}
          >
            Mis publicaciones
          </Link>
          <Link
            to="/mercado"
            style={{ padding: 'var(--spacing-sm) var(--spacing-lg)', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontWeight: 600 }}
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 var(--spacing-lg)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>
          Publicar un artículo
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          Completá los datos para que los vecinos puedan encontrarte.
        </p>
      </div>

      {!isAuthenticated && (
        <div style={{ padding: '1rem', backgroundColor: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#3730a3', fontSize: '0.9rem' }}>Te sugerimos iniciar sesión para que los compradores vean tu contacto.</span>
          <Link to="/mercado/login" style={{ backgroundColor: '#4f46e5', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
            Iniciar Sesión
          </Link>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Photos */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
            Fotos del producto ({images.length}/6)
          </label>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            multiple 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          <div 
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{ border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--color-bg-secondary)' }}
          >
            <p style={{ fontWeight: 600, margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Seleccionar fotos</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>Formatos JPG, PNG, WebP</p>
          </div>

          {imagePreviews.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
              {imagePreviews.map((src, idx) => (
                <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <img src={src} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)}
                    style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>Título *</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: Volkswagen Gol Trend 2018"
            style={{ width: '100%', padding: 'var(--spacing-md)', fontSize: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
            required
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>Precio ($) *</label>
            <input 
              type="number" 
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              style={{ width: '100%', padding: 'var(--spacing-md)', fontSize: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>Categoría *</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{ width: '100%', padding: 'var(--spacing-md)', fontSize: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
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
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>Descripción *</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            style={{ width: '100%', padding: 'var(--spacing-md)', fontSize: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)', resize: 'vertical' }}
            required
          ></textarea>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>Ubicación *</label>
          <input 
            type="text" 
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Ej: San José de Jáchal"
            style={{ width: '100%', padding: 'var(--spacing-md)', fontSize: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: '1rem' }}
        >
          {loading ? 'Publicando...' : 'Publicar Ahora'}
        </button>
      </form>
    </div>
  )
}
