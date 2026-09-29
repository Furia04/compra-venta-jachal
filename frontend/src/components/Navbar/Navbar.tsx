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
        <div className="hidden sm:inline-flex items-center p-1 bg-gray-100 rounded-xl text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-blue-700 shadow-xs">
            <Wrench size={13} className="text-blue-600" />
            Oficios & Servicios
          </span>
          <Link
            to="/mercado"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ShoppingBag size={13} className="text-purple-600" />
            Compra & Venta
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