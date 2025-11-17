import Sidebar from './Sidebar'
import './Layout.css'
import { useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const location = useLocation()

  const routeTitleMap = {
    '/': 'Main',
    '/productos': 'Productos',
    '/tasks': 'Tasks',
    '/help': 'Help',
  }

  const title = routeTitleMap[location.pathname] || 'App'

  return (
    <div className="app-frame">  
      <div className="app-layout">
        <Sidebar />

        <div className="main-container">
          <main className="main-content">{children}</main>
        </div>
      </div>
    </div>
  )
}
