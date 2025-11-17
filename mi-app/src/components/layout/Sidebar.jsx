import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BiMenu, BiHome, BiPurchaseTag, BiGroup } from 'react-icons/bi'
import logo from '../../assets/logo404.png'
import './sidebar.css'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)

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

        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BiHome className="nav-icon" />
          {!collapsed && <span className="nav-text">Main</span>}
        </NavLink>

        <NavLink to="/productos" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BiPurchaseTag className="nav-icon" />
          {!collapsed && <span className="nav-text">Products</span>}
        </NavLink>

        <NavLink to="/proveedores" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BiGroup className="nav-icon" />
          {!collapsed && <span className="nav-text">Suppliers</span>}
        </NavLink>

      </nav>

    </aside>
  )
}

export default Sidebar
