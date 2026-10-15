import { Routes, Route, Navigate } from 'react-router-dom'
/* 
============================================================
MODULO OFICIOSYA (ANULADO TEMPORALMENTE - COMENTADO)
============================================================
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import SearchResults from '../pages/SearchResults'
import CategoryPage from '../pages/CategoryPage'
import WorkerDetail from '../pages/WorkerDetail'
import WorkerRegister from '../pages/WorkerRegister'
============================================================
*/
import NotFound from '../pages/NotFound'
import FavoritesPage from '../pages/FavoritesPage'

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
      {/* 
      ============================================================
      PORTAL 1: OFICIOSYA (ANULADO - COMENTADO ÚNICAMENTE)
      ============================================================
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/oficios" element={<Home />} />
        <Route path="/buscar" element={<SearchResults />} />
        <Route path="/categoria/:id" element={<CategoryPage />} />
        <Route path="/trabajador/:id" element={<WorkerDetail />} />
        <Route path="/prestador/:id" element={<WorkerDetail />} />
        <Route path="/registro-trabajador" element={<WorkerRegister />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
      </Route>
      ============================================================
      */}

      {/* Portal Principal: Compra & Venta (Marketplace Jáchal Vende) */}
      <Route element={<MarketplaceLayout />}>
        <Route path="/" element={<MarketplaceHome />} />
        <Route path="/mercado" element={<MarketplaceHome />} />
        <Route path="/mercado/producto/:id" element={<ProductDetail />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/mercado/publicar" element={<Publish />} />
        <Route path="/publicar" element={<Publish />} />
        <Route path="/mercado/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mercado/registro" element={<Register />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/mercado/perfil" element={<Profile />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
      </Route>

      {/* Redirecciones de compatibilidad */}
      <Route path="/oficios" element={<Navigate to="/" replace />} />

      {/* 404 Not Found */}
      <Route element={<MarketplaceLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes