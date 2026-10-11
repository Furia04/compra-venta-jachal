import { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import type { Product } from '../types/product'
import { X, Save, DollarSign, Tag, MapPin, AlignLeft, Image } from 'lucide-react'

interface EditProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onSave: (updated: Partial<Product>) => Promise<void>
}

export default function EditProductModal({
  product,
  isOpen,
  onClose,
  onSave
}: EditProductModalProps) {
  const [formData, setFormData] = useState({
    title: product.title || '',
    price: product.price?.toString() || '0',
    category: product.category || 'otros',
    location: product.location || 'San José de Jáchal',
    description: product.description || '',
    imageUrl: product.images?.[0]?.url || product.image || ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('El título es obligatorio.')
      return
    }

    const numPrice = Number(formData.price)
    if (isNaN(numPrice) || numPrice < 0) {
      setError('El precio debe ser un número válido mayor o igual a 0.')
      return
    }

    setSaving(true)
    try {
      await onSave({
        title: formData.title.trim(),
        price: numPrice,
        category: formData.category,
        location: formData.location.trim(),
        description: formData.description.trim(),
        images: formData.imageUrl.trim()
          ? [{ url: formData.imageUrl.trim() }]
          : product.images
      })
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar los cambios'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900">Editar Publicación</h3>
            <p className="text-xs text-slate-500 mt-0.5">Modificá los detalles de tu artículo publicado</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Título del artículo *
            </label>
            <input 
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Bicicleta Mountain Bike R29"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-800 transition-all font-medium"
            />
          </div>

          {/* Precio y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <DollarSign size={13} className="text-brand-600" />
                <span>Precio ($) *</span>
              </label>
              <input 
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-800 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Tag size={13} className="text-brand-600" />
                <span>Categoría *</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-800 transition-all font-medium cursor-pointer"
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

          {/* Ubicación */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin size={13} className="text-brand-600" />
              <span>Ubicación</span>
            </label>
            <input 
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ej: San José de Jáchal, Niquivil..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-800 transition-all font-medium"
            />
          </div>

          {/* URL de Imagen */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Image size={13} className="text-brand-600" />
              <span>URL de Imagen Principal</span>
            </label>
            <input 
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-800 transition-all font-medium"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <AlignLeft size={13} className="text-brand-600" />
              <span>Descripción detallada</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detallá el estado, tiempo de uso y características del producto..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-800 transition-all font-medium resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
