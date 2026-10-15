import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { marketplaceApi } from '../services/marketplaceApi'
import type { Product } from '../types/product'
import { Phone, Mail, MapPin, Trash2, LogOut, PlusCircle, Loader2, Package, Sparkles, Pencil } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import EditProductModal from '../components/EditProductModal'
import { useToast } from '../../context/ToastContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()
  const [myListings, setMyListings] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

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
      setMyListings(myListings.filter((item) => item._id !== id && item.id !== id))
      showSuccess('Publicación eliminada correctamente')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar'
      showError(`Error al eliminar: ${msg}`)
    }
  }

  const handleSaveEdit = async (updatedFields: Partial<Product>) => {
    if (!editingProduct) return
    const targetId = editingProduct._id || editingProduct.id || ''
    try {
      const updated = await marketplaceApi.updateProduct(targetId, updatedFields)
      setMyListings((prev) =>
        prev.map((item) => (item._id === targetId || item.id === targetId ? { ...item, ...updated } : item))
      )
      showSuccess('¡Publicación actualizada correctamente!')
      setEditingProduct(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo actualizar'
      showError(msg)
      throw err
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/mercado')
  }

  if (!user) return null

  return (
    <div className="responsive-container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      
      {/* User Header Card */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(1.25rem, 4vw, 1.75rem)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.75rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            flexShrink: 0
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                {user.name}
              </h1>
              <span style={{
                backgroundColor: 'rgba(27, 73, 101, 0.1)',
                color: 'var(--color-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid rgba(27, 73, 101, 0.2)'
              }}>
                Vecino Jáchal
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={15} style={{ color: 'var(--color-primary)' }} />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={15} style={{ color: 'var(--color-primary)' }} />
                  <span>{user.phone}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} style={{ color: 'var(--color-primary)' }} />
                <span>{user.location || 'Jáchal, San Juan'}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/mercado/publicar"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.85rem',
              textDecoration: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <PlusCircle size={16} />
            <span>Nueva Publicación</span>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'transparent',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* My Listings Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={22} style={{ color: 'var(--color-primary)' }} />
            <span>Mis Publicaciones ({myListings.length})</span>
          </h2>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <Loader2 style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} size={32} />
          </div>
        ) : myListings.length === 0 ? (
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '3rem', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-primary)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>No tenés publicaciones activas</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              ¡Comenzá a vender lo que ya no usás en la comunidad de Jáchal hoy mismo!
            </p>
            <Link
              to="/mercado/publicar"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none'
              }}
            >
              <PlusCircle size={16} />
              <span>Publicar mi primer artículo</span>
            </Link>
          </div>
        ) : (
          <div className="responsive-grid-products">
            {myListings.map((product) => {
              const productId = product._id || product.id || ''
              return (
                <div key={productId} style={{ position: 'relative' }}>
                  <ProductCard product={product} />
                  
                  {/* Floating Action Buttons */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    zIndex: 20
                  }}>
                    <button
                      onClick={() => setEditingProduct(product)}
                      title="Editar publicación"
                      style={{
                        padding: '6px',
                        backgroundColor: '#ffffff',
                        color: 'var(--color-primary)',
                        border: '1px solid #cbd5e1',
                        borderRadius: '50%',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.15s, background-color 0.15s'
                      }}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(productId)}
                      title="Eliminar publicación"
                      style={{
                        padding: '6px',
                        backgroundColor: '#ffffff',
                        color: '#e11d48',
                        border: '1px solid #fecdd3',
                        borderRadius: '50%',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.15s, background-color 0.15s'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal de Edición de Publicación */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          isOpen={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveEdit}
        />
      )}

    </div>
  )
}
