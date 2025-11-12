import React, { useEffect, useState } from 'react'
import { providerService } from '../../api/services/providerService'
import Modal from '../../components/ui/Modal'
import './providerStyle.css'

const ProvidersPage = () => {
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Form/modal state
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState(null)
  const [editing, setEditing] = useState(null) // proveedor being edited or null
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' })

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null)

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

  // Open create form
  const handleNuevo = () => {
    setEditing(null)
    setFormData({ nombre: '', descripcion: '' })
    setFormError(null)
    setShowForm(true)
  }

  // Open edit form
  const handleEditar = (p) => {
    setEditing(p)
    setFormData({ nombre: p.nombre || '', descripcion: p.descripcion || '' })
    setFormError(null)
    setShowForm(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((s) => ({ ...s, [name]: value }))
  }

  const handleFormSubmit = async () => {
    setFormError(null)
    // simple validation
    if (!formData.nombre?.trim() || !formData.descripcion?.trim()) {
      setFormError('Nombre y descripción son obligatorios')
      return
    }
    setFormLoading(true)
    try {
      if (editing?._id) {
        await providerService.update(editing._id, { nombre: formData.nombre.trim(), descripcion: formData.descripcion.trim() })
      } else {
        await providerService.create({ nombre: formData.nombre.trim(), descripcion: formData.descripcion.trim() })
      }
      setShowForm(false)
      cargarProveedores()
    } catch (err) {
      console.error('Error guardando proveedor', err)
      setFormError(err.response?.data?.message || err.message || 'Error al guardar proveedor')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await providerService.delete(deleteId)
      setDeleteId(null)
      cargarProveedores()
    } catch (err) {
      console.error('Error eliminando proveedor', err)
      alert(err.response?.data?.message || 'No se pudo eliminar el proveedor')
    }
  }

  return (
    <div className="providers-page">
      <div className="providers-header">
        <h2>Proveedores</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-refresh" onClick={cargarProveedores} disabled={loading}>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
          <button className="btn-primary" onClick={handleNuevo}>Crear</button>
        </div>
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
                  <th style={{ width: 120 }}>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th style={{ width: 160 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map((p) => (
                  <tr key={p._id || p.id}>
                    <td className="mono">{p._id || p.id}</td>
                    <td>{p.nombre}</td>
                    <td>{p.descripcion}</td>
                    <td>
                      <button className="btn small" onClick={() => handleEditar(p)}>Editar</button>
                      <button className="btn danger small" onClick={() => handleDeleteClick(p._id || p.id)} style={{ marginLeft: 8 }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Form modal for create/edit */}
      <Modal open={showForm} title={editing ? 'Editar proveedor' : 'Crear proveedor'} onClose={() => setShowForm(false)} showCancel={true} onConfirm={handleFormSubmit} confirmText={formLoading ? 'Guardando...' : 'Guardar'}>
        <div className="provider-form">
          {formError && <p className="error">{formError}</p>}
          <div className="field">
            <label>Nombre</label>
            <input name="nombre" value={formData.nombre} onChange={handleFormChange} />
          </div>
          <div className="field">
            <label>Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleFormChange} rows={3} />
          </div>
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal open={!!deleteId} title="Confirmar eliminación" onClose={() => setDeleteId(null)} onConfirm={confirmDelete} confirmText="Sí, eliminar" showCancel={true}>
        <div>
          <p>¿Seguro que quieres eliminar este proveedor?</p>
        </div>
      </Modal>
    </div>
  )
}

export default ProvidersPage
