import React from 'react'
import { BiHome, BiBookAlt, BiMessage, BiSolidReport, BiTask, BiHelpCircle } from 'react-icons/bi'
import '../styles/Sidebar.css'

const Sidebar = () => {
    return (
        <div className='menu'>
            <div className='logo'>
                <BiBookAlt className='logo-icon'/>
                <h2>Menu</h2>
            </div>
            <div className="menu--list">
                <a href="#" className="item">
                    <BiHome className='icon'/>
                    Dashboard
                </a>
            </div>
            <div className="menu--list">
                <a href="#" className="item">
                    <BiMessage className='icon'/>
                    Messages
                </a>
            </div>
            <div className="menu--list">
                <a href="#" className="item">
                    <BiTask className='icon'/>
                    Tasks
                </a>
            </div>
            <div className="menu--list">
                <a href="#" className="item">
                    <BiHelpCircle className='icon'/>
                    Help
                </a>
            </div>
        </div>
    )
}

export default Sidebar
