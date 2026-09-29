import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Wrench, Package } from 'lucide-react'
import styles from './Navbar.module.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      {/* Top Portal Switcher Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="font-semibold opacity-90 hidden sm:inline">Plataforma Comunitaria de Jáchal:</span>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white text-blue-900 font-bold shadow-xs">
              <Wrench size={12} className="mr-1" />
              <span>Oficios & Servicios</span>
            </span>
            <Link 
              to="/mercado" 
              className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 transition-all font-medium text-white"
            >
              <Package size={12} className="mr-1" />
              <span>Compra & Venta</span>
            </Link>
          </div>
        </div>
        <div className="text-[11px] opacity-80 hidden md:block">
          San José de Jáchal, San Juan
        </div>
      </div>

      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>OficiosYa</Link>
        <div className={styles.links}>
          <Link to="/buscar" className="hover:opacity-80 transition-opacity">Buscar</Link>
          <Link to="/categoria/electricistas" className="hover:opacity-80 transition-opacity">Categorías</Link>
          <Link 
            to="/mercado" 
            className="text-purple-600 font-semibold bg-purple-50 px-2.5 py-1 rounded-lg hover:bg-purple-100 transition-colors"
          >
            🛍️ Jáchal Vende
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
    </div>
  )
}

export default Navbar