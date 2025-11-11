import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BiMenu, BiHome, BiPurchaseTag, BiGroup, BiHelpCircle } from 'react-icons/bi'
import './sidebar.css'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <span className="logo-icon"></span>
          <span className="logo-text">Menu</span>
        </div>

        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(v => !v)}
          aria-label="Toggle sidebar"
        >
          <BiMenu />
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <BiHome className="nav-icon" /><span className="nav-text">Principal</span>
        </NavLink>

        <NavLink to="/productos" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <BiPurchaseTag className="nav-icon" /><span className="nav-text">Productos</span>
        </NavLink>

        <NavLink to="/proveedores" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <BiGroup className="nav-icon" /><span className="nav-text">Proveedores</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {/* footer / logout */}
      </div>
    </aside>
  )
}

export default Sidebar