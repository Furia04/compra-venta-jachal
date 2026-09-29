import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Wrench, ShoppingBag } from 'lucide-react'
import styles from './Navbar.module.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()

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
        <Link to="/buscar" className="hover:opacity-80 transition-opacity">
          Buscar
        </Link>
        <Link to="/categoria/electricistas" className="hover:opacity-80 transition-opacity">
          Categorías
        </Link>
        <Link
          to="/mercado"
          className="sm:hidden text-purple-600 font-semibold bg-purple-50 px-2.5 py-1 rounded-lg hover:bg-purple-100 transition-colors"
        >
          🛍️ Mercado
        </Link>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label="Cambiar tema"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar