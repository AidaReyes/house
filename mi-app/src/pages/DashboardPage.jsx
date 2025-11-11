import React, { useEffect, useState } from 'react'
import ContentHeader from '../components/ContentHeader'
import Card from '../components/Card'
import {
  getProductos,
  deleteProducto,
} from '../apis/productosApi'
import ProductoForm from '../components/ProductoForm'

const DashboardPage = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [mostrandoForm, setMostrandoForm] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [idAEliminar, setIdAEliminar] = useState(null)

  // función que trae los productos del back
  const cargarProductos = async () => {
    try {
      const data = await getProductos() 
      setProductos(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    cargarProductos()
  }, [])

  const handleNuevo = () => {
    setProductoSeleccionado(null)
    setMostrandoForm(true)
  }

  const handleEditar = (producto) => {
    setProductoSeleccionado(producto)
    setMostrandoForm(true)
  }

  const handleGuardado = () => {
    cargarProductos()
    setMostrandoForm(false)
    setProductoSeleccionado(null)
  }

  const handleCerrarForm = () => {
    setMostrandoForm(false)
    setProductoSeleccionado(null)
  }

  // abrir confirmación de eliminar
  const handleEliminarClick = (id) => {
    setIdAEliminar(id)
  }

  const confirmarEliminar = async () => {
    try {
      await deleteProducto(idAEliminar)
      setIdAEliminar(null)
      cargarProductos()
    } catch (err) {
      console.error(err)
      alert('No se pudo eliminar')
    }
  }

  if (loading) return <p>Cargando productos...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="content">
      <ContentHeader />

      {/* botón de agregar */}
      <button onClick={handleNuevo} style={{ marginBottom: '1rem' }}>
        + Nuevo producto
      </button>

      {/* lastarjetas */}
      <Card
        productos={productos}
        onEdit={handleEditar}
        onDelete={handleEliminarClick}
      />

      {/* formulario de agregar y editar) */}
      {mostrandoForm && (
        <div className="modal-overlay">
          <ProductoForm
            productoSeleccionado={productoSeleccionado}
            onClose={handleCerrarForm}
            onSaved={handleGuardado}
          />
        </div>
      )}

      {/* confirmar pa eliminar */}
      {idAEliminar && (
        <div className="modal-overlay">
          <div
            style={{
              background: '#fff',
              padding: '1rem',
              borderRadius: '8px',
              maxWidth: '300px'
            }}
          >
            <p>¿Seguro que quieres eliminar este producto?</p>
            <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem' }}>
              <button onClick={confirmarEliminar}>Sí, eliminar</button>
              <button onClick={() => setIdAEliminar(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
