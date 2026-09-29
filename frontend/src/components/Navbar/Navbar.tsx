import { useTheme } from '../../context/ThemeContext'
import styles from './Navbar.module.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className={styles.navbar}>
      <span className={styles.logo}>OficiosYa</span>
      <div className={styles.links}>
        <span>Buscar</span>
        <span>Categorías</span>
        <span>Registrarme</span>
        <span>Iniciar sesión</span>
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