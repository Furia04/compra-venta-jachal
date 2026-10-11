import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { FavoritesProvider } from './context/FavoritesContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <FavoritesProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </FavoritesProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App