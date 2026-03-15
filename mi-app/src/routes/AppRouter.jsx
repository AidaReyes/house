import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';

// Layout
import Layout from '../modules/app/components/Layout.jsx';

// Pages internas
import DashboardPage from '../modules/app/pages/dashboardPage.jsx';
import ProductsPage from '../modules/product/pages/productPage.jsx';
import ProvidersPage from '../modules/provider/pages/providerPage.jsx';

import UsersPage from '../modules/user/pages/userPage.jsx';

import RolePage from '../modules/role/pages/rolePage.jsx';
import Permspage from '../modules/permits/page/permsPage.jsx';

// Pages públicas
import LoginPage from '../modules/app/pages/LoginPage.jsx';
import RegisterPage from '../modules/app/pages/RegisterPage.jsx';
import PerfilArrendador from '../modules/app/pages/PerfilArrendador.jsx';

import Can from '../components/can.jsx';
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
          <Route path="/arrendador" element={<PerfilArrendador />} />

          {/* Productos → admin, gerente, cajero */}
          <Route
            path="/productos"
            element={
              <Can permiso="PRODUCTO_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <ProductsPage />
              </Can>
            }
          />

          {/* Proveedores → admin, gerente */}
          <Route
            path="/proveedores"
            element={
              <Can permiso="PROVEEDOR_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <ProvidersPage />
              </Can>
            }
          />
          <Route
            path="/usuarios"
            element={
              <Can permiso="USER_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <UsersPage />
              </Can>
            }
          />
          <Route
            path="/roles"
            element={
              <Can permiso="ROL_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <RolePage />
              </Can>
            }
          />
          <Route
            path="/perms"
            
            element={
              <Can permiso="PERMISOS_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <Permspage />
              </Can>
            }
          />
        </Route>



        {/* Página de error si no tiene permisos */}
        <Route path="/no-autorizado" element={<h1>No autorizado</h1>} />

      </Routes>
    </BrowserRouter>
  );
}
