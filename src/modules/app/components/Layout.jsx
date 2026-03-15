import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app-frame">
      <div className="app-layout">
        <Sidebar />

        <div className="main-container">
          <Header />

          <main className="main-content">
            {/* 🔥 AQUI SE RENDERIZAN LOS PAGES */}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
