import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/layout.jsx';
import DashboardPage from '../pages/Dashboard/dashboardPage';
import ProductsPage from '../pages/Products/productPage.jsx';
import ProvidersPage from '../pages/Providers/providerPage.jsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/proveedores" element={<ProvidersPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
