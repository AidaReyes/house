import React, { useEffect, useState } from 'react'
import { providerService } from '../../api/services/providerService'
import Modal from '../../components/ui/Modal'
import './providerStyle.css'
import { useSearch } from '../../hook/useSearch'


const ProvidersPage = () => {
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' })


  const {
    query,
    filteredItems: proveedoresFiltrados,
    onChange: onSearchChange,
    clear: clearSearch,
  } = useSearch(proveedores, (p, q) => {
    const queryLower = q.toLowerCase()
    const id = String(p._id ?? p.id ?? '').toLowerCase()
    const nombre = String(p.nombre ?? '').toLowerCase()
    const descripcion = String(p.descripcion ?? '').toLowerCase()
    return (
      id.includes(queryLower) ||
      nombre.includes(queryLower) ||
      descripcion.includes(queryLower)
    )
  })


  const [deleteId, setDeleteId] = useState(null)


  const cargarProveedores = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await providerService.getAll()
      setProveedores(data || [])
    } catch (err) {
      setError(err.message || 'Error al cargar proveedores')
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => { cargarProveedores() }, [])


  const handleNuevo = () => {
    setEditing(null)
    setFormData({ nombre: '', descripcion: '' })
    setShowForm(true)
  }


  const handleEditar = (p) => {
    setEditing(p)
    setFormData({ nombre: p.nombre || '', descripcion: p.descripcion || '' })
    setShowForm(true)
  }


  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((s) => ({ ...s, [name]: value }))
  }


  const handleFormSubmit = async () => {
    setFormError(null)
    if (!formData.nombre?.trim() || !formData.descripcion?.trim()) {
      setFormError('Nombre y descripción son obligatorios')
      return
    }
    setFormLoading(true)
    try {
      if (editing?._id) {
        await providerService.update(editing._id, formData)
      } else {
        await providerService.create(formData)
      }
      setShowForm(false)
      cargarProveedores()
    } catch (err) {
      setFormError(err.message || 'Error al guardar proveedor')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="providers-page professional">
      <div className="providers-header">
        <h2>Proveedores</h2>
        <button className="btn-primary" onClick={handleNuevo}>Nuevo proveedor</button>
      </div>


      <form className="search" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Buscar proveedor..."
          value={query}
          onChange={onSearchChange}
          className="search-input"
        />
        <button type="button" className="search-clear" onClick={clearSearch}>Limpiar</button>
      </form>


      {loading && <p className="muted">Cargando...</p>}
      {error && <p className="error">{error}</p>}


      {!loading && !error && (
        <div className="providers-grid">
          {proveedoresFiltrados.length === 0 ? (
            <p className="muted">No hay resultados.</p>
          ) : (
            proveedoresFiltrados.map((p) => (
              <div className="provider-card pro" key={p._id}>
                <div className="provider-card-header">
                  <span className="provider-id">ID: {p._id}</span>
                </div>


                <div className="provider-card-body">
                  <h3>{p.nombre}</h3>
                  <p>{p.descripcion}</p>
                </div>


                <div className="provider-card-actions">
                  <button className="btn edit" onClick={() => handleEditar(p)}>Editar</button>
                  <button className="btn delete" onClick={() => setDeleteId(p._id)}>Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <Modal
        open={showForm}
        title={editing ? 'Editar proveedor' : 'Nuevo proveedor'}
        onClose={() => setShowForm(false)}
        onConfirm={handleFormSubmit}
        confirmText={formLoading ? 'Guardando...' : 'Guardar'}
        showCancel
      >
        <div className="provider-form">
          {formError && <p className="error">{formError}</p>}
          <label>Nombre</label>
          <input name="nombre" value={formData.nombre} onChange={handleFormChange} />


          <label>Descripción</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleFormChange} rows={3} />
        </div>
      </Modal>


      <Modal
        open={!!deleteId}
        title="Eliminar proveedor"
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { await providerService.delete(deleteId); setDeleteId(null); cargarProveedores(); }}
        confirmText="Eliminar"
        showCancel
      >
        <p>¿Seguro que deseas eliminar este proveedor?</p>
      </Modal>
    </div>
  )
}

export default ProvidersPage