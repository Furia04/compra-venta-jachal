import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShoppingBag, Wrench, UserCircle, LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--spacing-md) var(--spacing-lg)',
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Left side: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
        <Link 
          to="/mercado" 
          style={{
            fontWeight: 700,
            fontSize: '1.25rem',
            color: 'var(--color-primary)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ShoppingBag size={24} />
          Jáchal Vende
        </Link>
        
        {/* Switcher */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '2px',
          backgroundColor: 'var(--color-bg-secondary)'
        }} className="hidden md:flex">
          <Link
            to="/"
            style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              color: 'var(--color-text-secondary)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <Wrench size={14} /> Oficios
          </Link>
          <span style={{
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <ShoppingBag size={14} /> Compra & Venta
          </span>
        </div>
      </div>

      {/* Right side: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        <Link 
          to="/mercado/publicar"
          style={{
            padding: 'var(--spacing-xs) var(--spacing-md)',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          Publicar
        </Link>

        {isAuthenticated ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                color: 'var(--color-text)'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.85rem'
              }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                minWidth: '200px',
                overflow: 'hidden',
                zIndex: 10
              }}>
                <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text)' }}>{user?.name}</p>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{user?.email}</p>
                </div>
                <div style={{ padding: 'var(--spacing-xs) 0' }}>
                  <Link 
                    to="/mercado/perfil" 
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                      fontSize: '0.85rem'
                    }}
                  >
                    <UserCircle size={16} /> Mis publicaciones
                  </Link>
                  <button 
                    onClick={() => {
                      logout()
                      navigate('/mercado')
                      setDropdownOpen(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      color: 'var(--color-error)',
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <LogOut size={16} /> Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/mercado/login"
            style={{
              padding: 'var(--spacing-xs) var(--spacing-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-text)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  )
}
