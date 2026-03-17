import { useState } from "react";
import { NavLink } from "react-router-dom";
import { toggleTheme } from "../../../utils/theme.js";
import {
  FaBoxesStacked,
  FaChevronDown,
  FaGear,
  FaHandshake,
  FaHouse,
  FaKey,
  FaRightFromBracket,
  FaUsers,
  FaUserShield
} from "react-icons/fa6";

import perfil from "../../../assets/perfil.png";

import Can from "../../../components/can.jsx";
import { useAuth } from "../../../context/AuthContext";
import UserProfileModal from "../../../modules/user/components/UserProfileModal.jsx";

import "./header.css";

const Header = ({ toggleSidebar, sidebarOpen }) => {

  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="header">

      {/* LEFT */}
      <div className="header-left">



        <div className="header-logo">
          <span className="logo-text">
              <img id="logo" src="/logo.png" alt="Logo" />
          </span>
        </div>

      </div>

      {/* NAV */}
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
            <FaHandshake />
            <span>Cuartos</span>
          </NavLink>
        </Can>
        <NavLink
          to="/usuarios"
          className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}
        >
          <FaUsers />
          <span>Usuarios</span>
        </NavLink>


      </nav>
      

      {/* USER */}
      <div className="header-right">
<button onClick={toggleTheme}>
  🌙
</button>
        <div
          className="header-profile"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >

          <img
            src={user?.foto || perfil}
            alt={user?.nombre || user?.usuario}
            className="header-avatar"
            onError={(e) => {
              e.target.src = perfil;
            }}
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

        {/* MENU */}
        {showUserMenu && (
          <>
            <div
              className="header-menu-overlay"
              onClick={() => setShowUserMenu(false)}
            />

            <div className="header-menu">

              <button
                className="header-menu-item"
                onClick={() => {
                  setShowProfile(true);
                  setShowUserMenu(false);
                }}
              >
                <FaGear />
                <span>Mi Perfil</span>
              </button>

              <button
                className="header-menu-item logout"
                onClick={handleLogout}
              >
                <FaRightFromBracket />
                <span>Cerrar Sesión</span>
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