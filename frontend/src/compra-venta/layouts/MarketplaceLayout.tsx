import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function MarketplaceLayout() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  )
}
