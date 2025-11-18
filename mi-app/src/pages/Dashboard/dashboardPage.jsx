import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../../api/services/productService'
import { providerService } from '../../api/services/providerService'
import './dashboardStyle.css'

const DashboardPage = () => {
  const [stats, setStats] = useState({ products: 0, providers: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [products, providers] = await Promise.all([
          productService.getAll(),
          providerService.getAll(),
        ])
        setStats({ products: (products || []).length, providers: (providers || []).length })
      } catch (err) {
        console.error('Error cargando estadísticas:', err)
        setError(err.message || 'Error al cargar datos')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="dashboard-page">

      <div className="dashboard-header-box">
        <h1 className="dashboard-header-title">Hola, bienvenido a la pagina 404 NOT FOUND</h1>
        <p className="dashboard-header-sub">Resumen del sistema</p>
      </div>

      <div className="dashboard-actions">
      </div>

      {loading && <p className="muted">Cargando datos de inicio...</p>}
      {error && <p className="error">{error}</p>}

      <div className="welcome-card">
        <h2 className="welcome-title">¡BIENVENIDO!</h2>
        <p className="welcome-desc">Visualiza rápidamente productos, proveedores y opciones de acceso rápido.</p>
      </div>

      {!loading && !error && (
        <div className="card--container">
          <div className="stat-card">
            <div className="stat-title">Productos</div>
            <div className="stat-value">{stats.products}</div>
            <Link to="/productos" className="stat-link">Ver productos</Link>
          </div>

          <div className="stat-card">
            <div className="stat-title">Proveedores</div>
            <div className="stat-value">{stats.providers}</div>
            <Link to="/proveedores" className="stat-link">Ver proveedores</Link>
          </div>

        </div>
      )}
    </div>
  )
}

export default DashboardPage
