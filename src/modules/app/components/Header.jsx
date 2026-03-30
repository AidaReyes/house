import { useState } from "react";
import { NavLink } from "react-router-dom";
import { toggleTheme } from "../../../utils/theme.js";
import {
  FaBoxesStacked,
  FaChevronDown,
  FaFileContract,
  FaGear,
  FaHandshake,
  FaHouse,
  FaKey,
  FaMoon,
  FaMoneyBillWave,
  FaRightFromBracket,
  FaUsers,
  FaUserShield,
} from "react-icons/fa6";

import perfil from "../../../assets/perfil.png";

import Can from "../../../components/can.jsx";
import { useAuth } from "../../../context/AuthContext";
import UserProfileModal from "../../../modules/user/components/UserProfileModal.jsx";

import "./header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      setShowUserMenu(false);
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const closeMenu = () => setShowUserMenu(false);

  return (
    <header className="header">
      <div className="header-left">
        <NavLink to="/dashboard" className="header-logo" onClick={closeMenu}>
          <img id="logo" src="/logo.png" alt="Logo" />
        </NavLink>
      </div>

      <nav className="header-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}
        >
          <FaHouse />
          <span>Home</span>
        </NavLink>

        <Can permiso="ROL_LIST">
          <NavLink
            to="/roles"
            className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}
          >
            <FaUserShield />
            <span>Roles</span>
          </NavLink>
        </Can>

        <Can permiso="PERMISOS_LIST">
          <NavLink
            to="/perms"
            className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}
          >
            <FaKey />
            <span>Permisos</span>
          </NavLink>
        </Can>

        <Can permiso="PRODUCTO_LIST">
          <NavLink
            to="/productos"
            className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}
          >
            <FaBoxesStacked />
            <span>Productos</span>
          </NavLink>
        </Can>

        <Can permiso="PROVEEDOR_LIST">
          <NavLink
            to="/proveedores"
            className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}
          >
            <FaHandshake />
            <span>Proveedores</span>
          </NavLink>
        </Can>

        <Can permiso="RENT_LIST">
          <NavLink
            to="/renta"
            className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}
          >
            <FaHandshake />
            <span>Renta</span>
          </NavLink>
        </Can>

        <Can permiso="RENT_LIST">
          <NavLink
            to="/cuartos"
            className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}
          >
            <FaHouse />
            <span>Cuartos</span>
          </NavLink>
        </Can>

        <Can permiso="RENT_LIST">
          <NavLink
            to="/CuartosPublicados"
            className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}
          >
            <FaHouse />
            <span>Cuartos Publicados</span>
          </NavLink>
        </Can>

        {/* ← NUEVOS */}
        <Can permiso="SOLICITUD_LIST">
          <NavLink
            to="/solicitudes"
            className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}
          >
            <FaFileContract />
            <span>Solicitudes</span>
          </NavLink>
        </Can>

        <Can permiso="PAGO_LIST">
          <NavLink
            to="/pagos"
            className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}
          >
            <FaMoneyBillWave />
            <span>Pagos</span>
          </NavLink>
        </Can>

        <NavLink
          to="/usuarios"
          className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}
        >
          <FaUsers />
          <span>Usuarios</span>
        </NavLink>

        <NavLink
          to="/arrendador"
          className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}
        >
          <FaHandshake />
          <span>Arrendador</span>
        </NavLink>
      </nav>

      <div className="header-right">
        <button
          type="button"
          className="header-theme-btn"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
        >
          <FaMoon />
        </button>

        <div
          className="header-profile"
          onClick={() => setShowUserMenu((prev) => !prev)}
        >
          <img
            src={user?.foto || perfil}
            alt={user?.nombre || user?.usuario || "Usuario"}
            className="header-avatar"
            onError={(e) => { e.target.src = perfil; }}
          />

          <div className="header-user-info">
            <span className="header-user-name">
              {user?.nombre || user?.usuario}
            </span>
            <span className="header-user-role">
              {user?.rol?.nombre || "Usuario"}
            </span>
          </div>

          <FaChevronDown
            className={`header-arrow ${showUserMenu ? "rotated" : ""}`}
          />
        </div>

        {showUserMenu && (
          <>
            <div className="header-menu-overlay" onClick={closeMenu} />
            <div className="header-menu">
              <button
                type="button"
                className="header-menu-item"
                onClick={() => {
                  setShowProfile(true);
                  setShowUserMenu(false);
                }}
              >
                <FaGear />
                <span>Mi perfil</span>
              </button>

              <button
                type="button"
                className="header-menu-item logout"
                onClick={handleLogout}
              >
                <FaRightFromBracket />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </>
        )}
      </div>

      <UserProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </header>
  );
};

export default Header;