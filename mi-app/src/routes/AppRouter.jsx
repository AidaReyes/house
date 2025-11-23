import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import Layout from '../modules/app/components/Layout.jsx';

// Pages internas (dashboard con sidebar/navbar)
import DashboardPage from '../modules/app/pages/dashboardPage.jsx';
import ProductsPage from '../modules/product/pages/productPage.jsx';
import ProvidersPage from '../modules/provider/pages/providerPage.jsx';

// Pages públicas (sin layout)
import LoginPage from '../modules/app/pages/LoginPage.jsx';
import RegisterPage from '../modules/app/pages/RegisterPage.jsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Rutas públicas SIN layout */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔹 Rutas con layout (dashboard) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/proveedores" element={<ProvidersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

