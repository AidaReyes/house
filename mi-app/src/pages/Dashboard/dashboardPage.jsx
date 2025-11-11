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
      <div className="dashboard-actions">
        <h2>Inicio</h2>
      </div>

      {loading && <p className="muted">Cargando datos de inicio...</p>}
      {error && <p className="error">{error}</p>}

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

          <div className="stat-card">
            <div className="stat-title">Bienvenido</div>
            <div className="stat-value">Panel de inicio</div>
            <div className="stat-link muted">Resumen rápido</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
