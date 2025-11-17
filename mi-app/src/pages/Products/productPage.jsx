import React, { useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import ProductoForm from '../../components/custom/productForm'
import { productService } from '../../api/services/productService'
import Modal from '../../components/ui/Modal'
import { BiPlus } from 'react-icons/bi'
import './productStyle.css'

const DashboardPage = () => {
  const [productos, setProductos] = useState([])
  const [filteredProductos, setFilteredProductos] = useState(null)
  const [queryId, setQueryId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [mostrandoForm, setMostrandoForm] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  const [idAEliminar, setIdAEliminar] = useState(null)

  // ---------------------------------------------
  // Cargar productos
  // ---------------------------------------------
  const cargarProductos = async () => {
    try {
      const data = await productService.getAll()
      setProductos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  // ---------------------------------------------
  // CRUD
  // ---------------------------------------------
  const handleNuevo = () => {
    setProductoSeleccionado(null)
    setMostrandoForm(true)
  }

  const handleEditar = (prod) => {
    setProductoSeleccionado(prod)
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

  // ---------------------------------------------
  // BUSCADOR
  // ---------------------------------------------
  const handleSearchChange = (e) => {
    setQueryId(e.target.value)
    if (!e.target.value) setFilteredProductos(null)
  }

  const handleSearch = (e) => {
    e.preventDefault()

    if (!queryId.trim()) return setFilteredProductos(null)

    const result = productos.filter(p =>
      String(p._id || p.id)?.includes(queryId.trim())
    )

    setFilteredProductos(result.length ? result : [])
  }

  const limpiarBusqueda = () => {
    setQueryId('')
    setFilteredProductos(null)
  }

  // ---------------------------------------------
  // ELIMINAR
  // ---------------------------------------------
  const handleEliminarClick = (id) => setIdAEliminar(id)

  const confirmarEliminar = async () => {
    try {
      await productService.delete(idAEliminar)
      cargarProductos()
    } catch {
      alert("Error al eliminar")
    } finally {
      setIdAEliminar(null)
    }
  }

  if (loading) return <p>Cargando productos…</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="dashboard">

      {/* === Top actions === */}
      <div className="dashboard__actions">

        <form className="search" onSubmit={handleSearch}>
          <input
            placeholder="Buscar por ID"
            value={queryId}
            onChange={handleSearchChange}
          />
          <button type="submit">Buscar</button>
          <button type="button" onClick={limpiarBusqueda}>Limpiar</button>
        </form>

        <button className="btn-primary" onClick={handleNuevo}>
          <BiPlus size={20} /> Nuevo producto
        </button>
      </div>

      {/* === Product list === */}
      <Card
        productos={filteredProductos ?? productos}
        onEdit={handleEditar}
        onDelete={handleEliminarClick}
      />

      {/* === Form === */}
      <ProductoForm
        open={mostrandoForm}
        productoSeleccionado={productoSeleccionado}
        onClose={handleCerrarForm}
        onSaved={handleGuardado}
      />

      {/* === Modal === */}
      <Modal
        open={!!idAEliminar}
        title="Confirmar eliminación"
        onClose={() => setIdAEliminar(null)}
        onConfirm={confirmarEliminar}
        confirmText="Eliminar"
        showCancel
      >
        <p>¿Seguro que deseas eliminar este producto?</p>
      </Modal>
    </div>
  )
}

export default DashboardPage
