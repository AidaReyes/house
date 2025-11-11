import Sidebar from './Sidebar'
import Header from './Header'
import './Layout.css'
import { useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const location = useLocation()

  // Mapear rutas a títulos legibles
  const routeTitleMap = {
    '/': 'Main',
    '/productos': 'Productos',
    '/tasks': 'Tasks',
    '/help': 'Help',
    // añade aquí más rutas según tu AppRouter
  }

  const title = routeTitleMap[location.pathname] || 'App'

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-container">
        <Header title={title} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}