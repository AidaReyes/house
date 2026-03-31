import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { toggleTheme } from "../../../utils/theme.js";
import {
  FaHouse,
  FaShieldHalved,
  FaMoneyBillWave,
  FaChevronDown,
  FaUserShield,
  FaKey,
  FaBuilding,
  FaClipboardCheck,
  FaBullhorn,
  FaFileContract,
  FaUsers,
  FaUserTie,
  FaMoon,
  FaGear,
  FaRightFromBracket,
} from "react-icons/fa6";

import perfil from "../../../assets/perfil.png";

import Can from "../../../components/can.jsx";
import { useAuth } from "../../../context/AuthContext";
import UserProfileModal from "../../../modules/user/components/UserProfileModal.jsx";

import "./header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccessMenu, setShowAccessMenu] = useState(false);
  const [showPropertiesMenu, setShowPropertiesMenu] = useState(false);

  const isAccessActive =
    location.pathname === "/roles" || location.pathname === "/perms";

  const isPropertiesActive =
    location.pathname === "/cuartos" ||
    location.pathname === "/CuartosPublicados";

  const closeAllMenus = () => {
    setShowUserMenu(false);
    setShowAccessMenu(false);
    setShowPropertiesMenu(false);
  };

  const toggleAccessMenu = () => {
    setShowAccessMenu((prev) => !prev);
    setShowPropertiesMenu(false);
  };

  const togglePropertiesMenu = () => {
    setShowPropertiesMenu((prev) => !prev);
    setShowAccessMenu(false);
  };

  const handleLogout = async () => {
    try {
      setShowUserMenu(false);
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <NavLink
          to="/dashboard"
          className="header-logo"
          onClick={closeAllMenus}
        >
          <img src="/logo.png" alt="Logo" />
        </NavLink>
      </div>

      <nav className="header-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `header-link ${isActive ? "active" : ""}`
          }
          onClick={closeAllMenus}
        >
          <FaHouse />
          <span>Inicio</span>
        </NavLink>

        <Can permiso="RENT_LIST">
          <div className="header-dropdown">
            <button
              type="button"
              className={`header-link header-dropdown-toggle ${isPropertiesActive || showPropertiesMenu ? "active" : ""
                }`}
              onClick={togglePropertiesMenu}
            >
              <FaBuilding />
              <span>Propiedades</span>
              <FaChevronDown className={showPropertiesMenu ? "rotated" : ""} />
            </button>

            {showPropertiesMenu && (
              <div className="header-dropdown-menu">
                <Can permiso="USER_LIST" >
                  <NavLink
                    to="/cuartos"
                    className="header-dropdown-item"
                    onClick={closeAllMenus}
                  >
                    <FaClipboardCheck />
                    <span>Revisión de propiedades</span>
                  </NavLink>
                </Can>
                <NavLink
                  to="/CuartosPublicados"
                  className="header-dropdown-item"
                  onClick={closeAllMenus}
                >
                  <FaBullhorn />
                  <span>Propiedades publicadas</span>
                </NavLink>
              </div>
            )}
          </div>
        </Can>

        <Can permiso="RENT_LIST">
          <NavLink
            to="/renta"
            className={({ isActive }) =>
              `header-link ${isActive ? "active" : ""}`
            }
            onClick={closeAllMenus}
          >
            <FaFileContract />
            <span>Solicitudes de renta</span>
          </NavLink>
        </Can>
        <Can permiso="USER_LIST">
          <NavLink
            to="/usuarios"
            className={({ isActive }) =>
              `header-link ${isActive ? "active" : ""}`
            }
            onClick={closeAllMenus}
          >
            <FaUsers />
            <span>Usuarios</span>
          </NavLink>
        </Can>

        <NavLink
          to="/arrendador"
          className={({ isActive }) =>
            `header-link ${isActive ? "active" : ""}`
          }
          onClick={closeAllMenus}
        >
          <FaUserTie />
          <span>Propietarios</span>
        </NavLink>

        <NavLink
          to="/solicitudes"
          className={({ isActive }) =>
            `header-link ${isActive ? "active" : ""}`
          }
          onClick={closeAllMenus}
        >
          <FaFileContract />
          <span>Solicitudes</span>
        </NavLink>

        <NavLink
          to="/pagos"
          className={({ isActive }) =>
            `header-link ${isActive ? "active" : ""}`
          }
          onClick={closeAllMenus}
        >
          <FaMoneyBillWave />
          <span>Pagos</span>
        </NavLink>

        <Can permisos={["ROL_LIST", "PERMISOS_LIST"]}>
          <div className="header-dropdown">
            <button
              type="button"
              className={`header-link header-dropdown-toggle ${isAccessActive || showAccessMenu ? "active" : ""
                }`}
              onClick={toggleAccessMenu}
            >
              <FaShieldHalved />
              <span>Gestión de accesos</span>
              <FaChevronDown className={showAccessMenu ? "rotated" : ""} />
            </button>

            {showAccessMenu && (
              <div className="header-dropdown-menu">
                <Can permiso="ROL_LIST">
                  <NavLink
                    to="/roles"
                    className="header-dropdown-item"
                    onClick={closeAllMenus}
                  >
                    <FaUserShield />
                    <span>Roles</span>
                  </NavLink>
                </Can>

                <Can permiso="PERMISOS_LIST">
                  <NavLink
                    to="/perms"
                    className="header-dropdown-item"
                    onClick={closeAllMenus}
                  >
                    <FaKey />
                    <span>Permisos</span>
                  </NavLink>
                </Can>
              </div>
            )}
          </div>
        </Can>
      </nav>

      <div className="header-right">
        <button
          type="button"
          className="header-theme-btn"
          onClick={toggleTheme}
        >
          <FaMoon />
        </button>

        <div
          className="header-profile"
          onClick={() => setShowUserMenu((prev) => !prev)}
        >
          <img
            src={user?.foto || perfil}
            alt="Usuario"
            className="header-avatar"
          />

          <div className="header-user-info">
            <span>{user?.nombre || user?.usuario}</span>
            <small>{user?.rol?.nombre || "Usuario"}</small>
          </div>

          <FaChevronDown />
        </div>

        {showUserMenu && (
          <>
            <div
              className="header-menu-overlay"
              onClick={() => setShowUserMenu(false)}
            />

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
                Mi perfil
              </button>

              <button
                type="button"
                className="header-menu-item logout"
                onClick={handleLogout}
              >
                <FaRightFromBracket />
                Cerrar sesión
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