import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BiMenu, BiHome, BiMessageSquare, BiCheckSquare, BiHelpCircle } from 'react-icons/bi'
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
          <BiHome className="nav-icon" /><span className="nav-text">Dashboard</span>
        </NavLink>

        <NavLink to="/messages" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <BiMessageSquare className="nav-icon" /><span className="nav-text">Messages</span>
        </NavLink>

        <NavLink to="/tasks" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <BiCheckSquare className="nav-icon" /><span className="nav-text">Tasks</span>
        </NavLink>

        <NavLink to="/help" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <BiHelpCircle className="nav-icon" /><span className="nav-text">Help</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {/* footer / logout */}
      </div>
    </aside>
  )
}

export default Sidebar