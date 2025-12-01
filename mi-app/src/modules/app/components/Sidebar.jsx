import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import {
  FaHouse,
  FaUserShield,
  FaKey,
  FaBoxesStacked,
  FaHandshake,
  FaUsers,
  FaBars
} from "react-icons/fa6";

import logo from '../../../assets/logo404.png';
import perfil from '../../../assets/perfil.png'; 
import './sidebar.css';

import { useAuth } from '../../../context/AuthContext';
import Can from '../../../components/can.jsx';
import UserProfileModal from '../../../modules/user/components/UserProfileModal.jsx';

const Sidebar = () => {

  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 900);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

      {/* LOGO + NOMBRE TOP */}
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="logo-icon" />
        {!collapsed && <small>{user?.nombre || user?.usuario}</small>}
      </div>

      {/* BOTÓN DE CONTRAER */}
      <div className="sidebar-toggle-container">
        <button className="sidebar-toggle" onClick={() => setCollapsed(v => !v)}>
          <FaBars />
        </button>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="sidebar-nav">

        <NavLink to="/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FaHouse className="nav-icon" />
          {!collapsed && <span className="nav-text">Home</span>}
        </NavLink>

        <Can permiso="ROL_LIST">
          <NavLink to="/roles" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaUserShield className="nav-icon" />
            {!collapsed && <span className="nav-text">Roles</span>}
          </NavLink>
        </Can>

        <Can permiso="PERMISOS_LIST">
          <NavLink to="/perms" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaKey className="nav-icon" />
            {!collapsed && <span className="nav-text">Permisos</span>}
          </NavLink>
        </Can>

        <Can permiso="PRODUCTO_LIST">
          <NavLink to="/productos" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaBoxesStacked className="nav-icon" />
            {!collapsed && <span className="nav-text">Productos</span>}
          </NavLink>
        </Can>

        <Can permiso="PROVEEDOR_LIST">
          <NavLink to="/proveedores" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaHandshake className="nav-icon" />
            {!collapsed && <span className="nav-text">Proveedores</span>}
          </NavLink>
        </Can>

        <Can permiso="USER_LIST">
          <NavLink to="/usuarios" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaUsers className="nav-icon" />
            {!collapsed && <span className="nav-text">Usuarios</span>}
          </NavLink>
        </Can>
      </nav>

      <div className="sidebar-profile" onClick={() => setShowProfile(true)}>
        <img
          src={user?.foto || perfil}     
          alt="Perfil"
          className="profile-avatar"
        />
        {!collapsed && (
          <div className="profile-info">
            <span className="profile-name">{user?.nombre || user?.usuario}</span>
            <small className="profile-link">Ver perfil</small>
          </div>
        )}
      </div>

      <UserProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </aside>
  );
}

export default Sidebar;
