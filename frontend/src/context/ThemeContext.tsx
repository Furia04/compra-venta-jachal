import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'oficiosya-theme'

/**
 * Obtiene el tema visual inicial guardado en localStorage o 'light' por defecto.
 * @returns {Theme} 'light' | 'dark'
 */
function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
}

/**
 * Proveedor de contexto para la gestión del tema visual (Modo Claro / Modo Oscuro).
 * Aplica el atributo `data-theme` al elemento raíz `<html>` y persiste la preferencia del usuario en `localStorage`.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Sincronizar el atributo HTML y el almacenamiento local cada vez que cambia el tema
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  /**
   * Alterna entre modo claro y modo oscuro.
   */
  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook personalizado para acceder al tema visual actual y a la función para alternarlo.
 * @throws {Error} si se invoca fuera del árbol de un ThemeProvider.
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider')
  }
  return context
}