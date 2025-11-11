import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
// import MessagesPage from './pages/MessagesPage'
// import TasksPage from './pages/TasksPage'
// import HelpPage from './pages/HelpPage'
import './styles/sidebar.css'
import './styles/content.css'

function App() {
  return (
    <BrowserRouter>
      <div className="dashboard" style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />

        <div className="dashboard--content" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            {/* <Route path="/messages" element={<MessagesPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/help" element={<HelpPage />} /> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App