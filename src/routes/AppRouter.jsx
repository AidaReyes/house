import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Landing
import RentaZacLanding from '../modules/app/pages/RentaZacLanding.jsx';

// Layout
import Layout from "../modules/app/components/Layout.jsx";

// Pages internas
import DashboardPage from '../modules/app/pages/dashboardPage.jsx';
import Cuartos from "../modules/rooms/page/roomsPage.jsx";
import PublicadoPage from "../modules/rooms/page/publicadosPage.jsx";
import ProductsPage from '../modules/product/pages/productPage.jsx';
import ProvidersPage from '../modules/provider/pages/providerPage.jsx';
import UsersPage from '../modules/user/pages/userPage.jsx';
import Permspage from '../modules/permits/page/permsPage.jsx';
import RentPage from '../modules/rents/pages/rentpage.jsx';
import RolePage from '../modules/role/pages/rolePage.jsx';
import PerfilArrendador from '../modules/app/pages/PerfilArrendador.jsx';

// ← NUEVAS
import SolicitudPage from '../modules/solicitudes/components/SolicitudPage.jsx';
import PagoPage from '../modules/pagos/components/PagoPage.jsx';

// Pages públicas
import LoginPage from '../modules/app/pages/LoginPage.jsx';
import RegisterPage from '../modules/app/pages/RegisterPage.jsx';

import Can from '../components/can.jsx';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 Landing */}
        <Route
          path="/"
          element={
            <RentaZacLanding
              onLogin={() => window.location.href = '/login'}
              onRegister={() => window.location.href = '/register'}
            />
          }
        />

        {/* 🔓 Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔒 Privadas */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/arrendador" element={<PerfilArrendador />} />

          {/* Cuartos */}
          <Route path="/cuartos" element={<Cuartos />} />

          {/* Productos */}
          <Route
            path="/productos"
            element={
              <Can permiso="PRODUCTO_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <ProductsPage />
              </Can>
            }
          />

          {/* Proveedores */}
          <Route
            path="/proveedores"
            element={
              <Can permiso="PROVEEDOR_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <ProvidersPage />
              </Can>
            }
          />

          {/* Usuarios */}
          <Route
            path="/usuarios"
            element={
              <Can permiso="USER_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <UsersPage />
              </Can>
            }
          />

          {/* Roles */}
          <Route
            path="/roles"
            element={
              <Can permiso="ROL_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <RolePage />
              </Can>
            }
          />

          {/* Permisos */}
          <Route
            path="/perms"
            element={
              <Can permiso="PERMISOS_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <Permspage />
              </Can>
            }
          />

          {/* Rentas */}
          <Route
            path="/renta"
            element={
              <Can permiso="RENT_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <RentPage />
              </Can>
            }
          />

          {/* Cuartos Publicados */}
          <Route
            path="/CuartosPublicados"
            element={
              <Can permiso="RENT_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <PublicadoPage />
              </Can>
            }
          />

          {/* Solicitudes ← NUEVA */}
          <Route
            path="/solicitudes"
            element={
              <Can permiso="SOLICITUD_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <SolicitudPage />
              </Can>
            }
          />

          {/* Pagos ← NUEVA */}
          <Route
            path="/pagos"
            element={
              <Can permiso="PAGO_LIST" fellback={<Navigate to="/no-autorizado" replace />}>
                <PagoPage />
              </Can>
            }
          />

        </Route>

        {/* ❌ No autorizado */}
        <Route path="/no-autorizado" element={<h1>No autorizado</h1>} />

      </Routes>
    </BrowserRouter>
  );
}