import React, { useEffect, useState } from 'react'
import { providerService } from '../../api/services/providerService'
import './providerStyle.css'

const ProvidersPage = () => {
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarProveedores = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await providerService.getAll()
      setProveedores(data || [])
    } catch (err) {
      console.error('Error cargando proveedores', err)
      setError(err.message || 'Error al cargar proveedores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarProveedores()
  }, [])

  return (
    <div className="providers-page">
      <div className="providers-header">
        <h2>Proveedores</h2>
        <button className="btn-refresh" onClick={cargarProveedores} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {loading && <p className="muted">Cargando proveedores...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && (
        <div className="table-wrap">
          {proveedores.length === 0 ? (
            <p className="muted">No hay proveedores registrados.</p>
          ) : (
            <table className="providers-table">
              <thead>
                <tr>
                  <th style={{ width: 140 }}>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map((p) => (
                  <tr key={p._id || p.id}>
                    <td className="mono">{p._id || p.id}</td>
                    <td>{p.nombre}</td>
                    <td>{p.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default ProvidersPage
