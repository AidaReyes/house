import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BiMenu, BiHome, BiPurchaseTag, BiGroup, BiUser } from 'react-icons/bi'
import logo from '../../../assets/logo404.png'
import './sidebar.css'
import { useAuth } from '../../../context/AuthContext'
import Can from '../../../components/can.jsx';
import UserProfileModal from '../../../modules/user/components/UserProfileModal.jsx';

const Sidebar = () => {

  const { user } = useAuth();        
  const role = user?.rol;                

  const [collapsed, setCollapsed] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 900
  );
  const [showProfile, setShowProfile] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="logo-icon" />
      </div>

      <div className="sidebar-toggle-container">
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(v => !v)}
          aria-label="Toggle sidebar"
        >
          <BiMenu />
        </button>
      </div>

      <nav className="sidebar-nav">

        {/* ---- Home (para todos) ---- */}
        <NavLink to="/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BiHome className="nav-icon" />
          {!collapsed && <span className="nav-text">Home</span>}
        </NavLink>

        {/* ---- Roles ---- */}
        <Can permiso="ROL_LIST">
          <NavLink to="/roles" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BiHome className="nav-icon" />
            {!collapsed && <span className="nav-text">Roles</span>}
          </NavLink>
        </Can>

        {/* ---- Permisos ---- */}
        <Can permiso="PERMISOS_LIST">
          <NavLink to="/perms" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BiHome className="nav-icon" />
            {!collapsed && <span className="nav-text">Permisos</span>}
          </NavLink>
        </Can>

        {/* ---- Productos ---- */}
        <Can permiso="PRODUCTO_LIST">
          <NavLink to="/productos" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BiPurchaseTag className="nav-icon" />
            {!collapsed && <span className="nav-text">Productos</span>}
          </NavLink>
        </Can>

        {/* ---- Proveedores ---- */}
        <Can permiso="PROVEEDOR_LIST">
          <NavLink to="/proveedores" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BiGroup className="nav-icon" />
            {!collapsed && <span className="nav-text">Proveedores</span>}
          </NavLink>
        </Can>

        {/* ---- Usuarios ---- */}
        <Can permiso="USER_LIST">
          <NavLink to="/usuarios" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BiGroup className="nav-icon" />
            {!collapsed && <span className="nav-text">Usuarios</span>}
          </NavLink>
        </Can>
        
        {/* ---- Mi Perfil ---- */}
        <button
        type="button"
        className="nav-item profile-link"
        onClick={() => setShowProfile(true)}>
          <BiUser className="nav-icon" />
          {!collapsed && <span className="nav-text">Mi perfil</span>}
          </button>



      </nav>

      {/* Modal de perfil */}
      <UserProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </aside>
  )
}

export default Sidebar;
