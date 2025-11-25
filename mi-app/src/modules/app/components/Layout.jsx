import Sidebar from './Sidebar';
import './Layout.css';
import { useLocation, Outlet } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  const routeTitleMap = {
    '/dashboard': 'Inicio',
    '/productos': 'Productos',
    '/proveedores': 'Proveedores',
    '/usuarios': 'Usuarios',
    '/roles': 'Roles',
  };

  const title = routeTitleMap[location.pathname] || 'App';

  return (
    <div className="app-frame">
      <div className="app-layout">
        <Sidebar />

        <div className="main-container">
          {/* Puedes mostrar un header si quieres */}
          {/* <h1>{title}</h1> */}

          <main className="main-content">
            {/* 🔥 AQUI SE RENDERIZAN LOS PAGES */}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
