import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useFavorites } from '../../context/FavoritesContext'
import { Wrench, ShoppingBag, UserPlus, LogOut, UserCircle, Heart } from 'lucide-react'
import styles from './Navbar.module.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, isAuthenticated, logout } = useAuth()
  const { totalFavoritesCount } = useFavorites()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className={styles.navbar}>
      <div className="flex items-center space-x-6">
        <Link to="/" className={styles.logo}>
          OficiosYa
        </Link>

        {/* Switcher entre emprendimientos */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '2px',
          backgroundColor: 'var(--color-bg-secondary)'
        }} className="hidden md:flex">
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
            <Wrench size={14} /> Oficios & Servicios
          </span>
          <Link
            to="/mercado"
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
            <ShoppingBag size={14} /> Compra & Venta
          </Link>
        </div>
      </div>

      <div className={styles.links}>
        <Link to="/buscar" className="hover:opacity-80 transition-opacity hidden sm:inline">
          Buscar
        </Link>
        <Link to="/categoria/electricista" className="hover:opacity-80 transition-opacity hidden sm:inline">
          Categorías
        </Link>
        
        <Link
          to="/registro-trabajador"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(27, 73, 101, 0.1)',
            color: 'var(--color-primary)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          <UserPlus size={15} />
          <span className="hidden md:inline">Ofrecer Servicio</span>
        </Link>

        {/* Favoritos */}
        <Link
          to="/favoritos"
          title="Ver favoritos"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: totalFavoritesCount > 0 ? '#E11D48' : 'var(--color-text)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            padding: '4px 6px'
          }}
        >
          <Heart size={18} className={totalFavoritesCount > 0 ? 'fill-current' : ''} />
          {totalFavoritesCount > 0 && (
            <span style={{
              backgroundColor: '#E11D48',
              color: 'white',
              fontSize: '10px',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '999px',
              marginLeft: '-2px'
            }}>
              {totalFavoritesCount}
            </span>
          )}
        </Link>

        {/* Auth / Session Menu */}
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
                top: '125%',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)',
                minWidth: '200px',
                overflow: 'hidden',
                zIndex: 100
              }}>
                <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                  <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-text)' }}>{user?.name}</p>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>{user?.email}</p>
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
            style={{
              padding: '6px 14px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-text)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            Ingresar
          </Link>
        )}

        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          style={{ cursor: 'pointer' }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar