import { useState, useEffect } from "react";
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

const Header = () => {

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

  // cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowUserMenu(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // NAV dinámico
  const navItems = [
    { to: "/dashboard", icon: <FaHouse />, label: "Home" },
    { to: "/roles", icon: <FaUserShield />, label: "Roles", permiso: "ROL_LIST" },
    { to: "/perms", icon: <FaKey />, label: "Permisos", permiso: "PERMISOS_LIST" },
    { to: "/productos", icon: <FaBoxesStacked />, label: "Productos", permiso: "PRODUCTO_LIST" },
    { to: "/proveedores", icon: <FaHandshake />, label: "Proveedores", permiso: "PROVEEDOR_LIST" },
    { to: "/renta", icon: <FaHandshake />, label: "Renta", permiso: "RENT_LIST" },
    { to: "/cuartos", icon: <FaHandshake />, label: "Cuartos", permiso: "RENT_LIST" },
    { to: "/usuarios", icon: <FaUsers />, label: "Usuarios" }
  ];

  return (
    <header className="header">

      {/* LEFT */}
      <div className="header-left">
        <div className="header-logo">
          <img src="/logo2.png" alt="Logo" />
        </div>
      </div>

      {/* NAV */}
      <nav className="header-nav">
        {navItems.map((item, index) => {
          const link = (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `header-link ${isActive ? "active" : ""}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          );

          return item.permiso ? (
            <Can key={index} permiso={item.permiso}>
              {link}
            </Can>
          ) : link;
        })}
      </nav>

      {/* RIGHT */}
      <div className="header-right">

        <button className="theme-btn" onClick={toggleTheme}>
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