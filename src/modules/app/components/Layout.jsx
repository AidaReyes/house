import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import SessionExpiredModal from '../../../components/SessionExpiredModal';

export default function Layout() {

  const navigate = useNavigate();

  const [sessionModal, setSessionModal] = useState({
    open: false,
    message: ""
  });

  useEffect(() => {

    const handleSessionExpired = (event) => {

      setSessionModal({
        open: true,
        message: event.detail.message
      });

    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };

  }, []);

  const goLogin = () => {

    localStorage.removeItem("token");
    navigate("/");

  };

  return (

    <div className="app-frame">

      <div className="app-layout">

        <Sidebar />

        <div className="main-container">

          <Header />

          <main className="main-content">
            <Outlet />
          </main>

        </div>

      </div>

      {/* MODAL DE SESION EXPIRADA */}

      <SessionExpiredModal
        open={sessionModal.open}
        message={sessionModal.message}
        onConfirm={goLogin}
      />

    </div>

  );

}