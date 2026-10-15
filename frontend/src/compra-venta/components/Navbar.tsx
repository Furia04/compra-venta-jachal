import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../../context/FavoritesContext'
import { ShoppingBag, UserCircle, LogOut, Heart } from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalFavoritesCount } = useFavorites()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="flex justify-between items-center px-3 sm:px-6 py-2.5 sm:py-3.5 bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-50">
      {/* Left side: Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link 
          to="/" 
          className="font-extrabold text-base sm:text-xl text-[var(--color-primary)] flex items-center gap-1.5 sm:gap-2 tracking-tight"
        >
          <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          <span>Jáchal Vende</span>
        </Link>
        
        {/* Switcher OficiosYa - Anulado / Comentado temporalmente */}
        {/*
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
        */}
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <Link
          to="/favoritos"
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded text-[var(--color-text)] text-xs sm:text-sm font-medium relative hover:bg-[var(--color-bg-secondary)] transition-colors"
          title="Ver favoritos guardados"
        >
          <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" style={{ color: totalFavoritesCount > 0 ? '#e11d48' : 'currentColor' }} />
          <span className="hidden sm:inline">Favoritos</span>
          {totalFavoritesCount > 0 && (
            <span style={{
              backgroundColor: '#e11d48',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '1px 5px',
              borderRadius: '9999px',
              lineHeight: 1.2
            }}>
              {totalFavoritesCount}
            </span>
          )}
        </Link>

        <Link 
          to="/mercado/publicar"
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--color-primary)] text-white rounded text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity shadow-xs"
        >
          Publicar
        </Link>

        {isAuthenticated ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-1 sm:p-1.5 bg-transparent border-0 flex items-center gap-1.5 cursor-pointer text-[var(--color-text)]"
              aria-label="Menú de usuario"
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
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                minWidth: '200px',
                maxWidth: 'calc(100vw - 2rem)',
                overflow: 'hidden',
                zIndex: 60
              }}>
                <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text)' }}>{user?.name}</p>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
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
                      navigate('/')
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
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 border border-[var(--color-border)] bg-transparent text-[var(--color-text)] rounded text-xs sm:text-sm font-semibold hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  )
}
