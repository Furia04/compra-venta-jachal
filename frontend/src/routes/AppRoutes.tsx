import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import SearchResults from '../pages/SearchResults'
import CategoryPage from '../pages/CategoryPage'
import NotFound from '../pages/NotFound'

// Módulo Compra y Venta (Marketplace Jáchal Vende)
import MarketplaceLayout from '../compra-venta/layouts/MarketplaceLayout'
import MarketplaceHome from '../compra-venta/pages/Home'
import ProductDetail from '../compra-venta/pages/ProductDetail'
import Publish from '../compra-venta/pages/Publish'
import Login from '../compra-venta/pages/Login'
import Register from '../compra-venta/pages/Register'
import Profile from '../compra-venta/pages/Profile'

function AppRoutes() {
  return (
    <Routes>
      {/* Portal 1: OficiosYa (Servicios & Profesionales) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/oficios" element={<Home />} />
        <Route path="/buscar" element={<SearchResults />} />
        <Route path="/categoria/:id" element={<CategoryPage />} />
      </Route>

      {/* Portal 2: Compra & Venta (Marketplace Jáchal Vende) */}
      <Route path="/mercado" element={<MarketplaceLayout />}>
        <Route index element={<MarketplaceHome />} />
        <Route path="producto/:id" element={<ProductDetail />} />
        <Route path="publicar" element={<Publish />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Register />} />
        <Route path="perfil" element={<Profile />} />
      </Route>

      {/* Redirecciones de conveniencia para rutas de Compra y Venta */}
      <Route path="/producto/:id" element={<Navigate to="/mercado/producto/:id" replace />} />
      <Route path="/publicar" element={<Navigate to="/mercado/publicar" replace />} />
      <Route path="/login" element={<Navigate to="/mercado/login" replace />} />
      <Route path="/registro" element={<Navigate to="/mercado/registro" replace />} />
      <Route path="/perfil" element={<Navigate to="/mercado/perfil" replace />} />

      {/* 404 Not Found */}
      <Route element={<MainLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes