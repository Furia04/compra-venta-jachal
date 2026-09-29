import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function MarketplaceLayout() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  )
}
