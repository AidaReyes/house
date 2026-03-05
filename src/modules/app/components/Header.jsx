import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  FaHouse,
  FaUserShield,
  FaKey,
  FaBoxesStacked,
  FaHandshake,
  FaUsers,
  FaBars
} from "react-icons/fa6";

import perfil from "../../../assets/perfil.png";

import { useAuth } from "../../../context/AuthContext";
import Can from "../../../components/can.jsx";
import UserProfileModal from "../../../modules/user/components/UserProfileModal.jsx";

import "./header.css";

const Header = ({ toggleSidebar }) => {

  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="header">

      {/* BOTON MENU */}
      <button className="menu-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* NAVEGACION */}
      <nav className="header-nav">

        <NavLink to="/dashboard" className="header-link">
          <FaHouse />
          <span>Home</span>
        </NavLink>

        <Can permiso="ROL_LIST">
          <NavLink to="/roles" className="header-link">
            <FaUserShield />
            <span>Roles</span>
          </NavLink>
        </Can>

        <Can permiso="PERMISOS_LIST">
          <NavLink to="/perms" className="header-link">
            <FaKey />
            <span>Permisos</span>
          </NavLink>
        </Can>

        <Can permiso="PRODUCTO_LIST">
          <NavLink to="/productos" className="header-link">
            <FaBoxesStacked />
            <span>Productos</span>
          </NavLink>
        </Can>

        <Can permiso="PROVEEDOR_LIST">
          <NavLink to="/proveedores" className="header-link">
            <FaHandshake />
            <span>Proveedores</span>
          </NavLink>
        </Can>

        <NavLink to="/usuarios" className="header-link">
          <FaUsers />
          <span>Usuarios</span>
        </NavLink>

      </nav>

      {/* PERFIL */}
      <div className="header-profile" onClick={() => setShowProfile(true)}>
        <img
          src={user?.foto || perfil}
          alt="Perfil"
          className="header-avatar"
        />
        <span className="header-user">
          {user?.nombre || user?.usuario}
        </span>
      </div>

      <UserProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

    </header>
  );
};

export default Header;