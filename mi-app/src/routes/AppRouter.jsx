import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import Layout from '../modules/app/components/Layout.jsx';

// Pages internas
import DashboardPage from '../modules/app/pages/dashboardPage.jsx';
import ProductsPage from '../modules/product/pages/productPage.jsx';
import ProvidersPage from '../modules/provider/pages/providerPage.jsx';
import UsersPage from '../modules/user/pages/userPage.jsx';

// Pages públicas
import LoginPage from '../modules/app/pages/LoginPage.jsx';
import RegisterPage from '../modules/app/pages/RegisterPage.jsx';

// Protected route
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas privadas con layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Productos → admin, gerente, cajero */}
          <Route
            path="/productos"
            element={
              <ProtectedRoute roles={["admin", "gerente", "cajero"]}>
                <ProductsPage />
              </ProtectedRoute>
            }
          />

          {/* Proveedores → admin, gerente */}
          <Route
            path="/proveedores"
            element={
              <ProtectedRoute roles={["admin", "gerente"]}>
                <ProvidersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute roles={["admin"]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
        </Route>



        {/* Página de error si no tiene permisos */}
        <Route path="/no-autorizado" element={<h1>No autorizado</h1>} />

      </Routes>
    </BrowserRouter>
  );
}
