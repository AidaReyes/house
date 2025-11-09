import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar.jsx'
import Profile from './components/Profile.jsx'
import Content from './components/content.jsx'

function App() {

  return (
    <>
      <div className='dashboard'>
        <Sidebar />
        <div className='dashboard--content'>
          <Content />
          <Profile />
        </div>
      </div>
    </>
  )
}

export default App
