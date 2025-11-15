import React, { useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import ProductoForm from '../../components/custom/productForm'
import { productService } from '../../api/services/productService'
import Modal from '../../components/ui/Modal'
import { BiPlus } from 'react-icons/bi'
import { useSearch } from "../../hook/useSearch"; // ✅ ruta al hook

import './productStyle.css'

const DashboardPage = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mostrandoForm, setMostrandoForm] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [idAEliminar, setIdAEliminar] = useState(null)
  //const [queryId, setQueryId] = useState('')
  const [filteredProductos, setFilteredProductos] = useState(null)
  //  Hook de búsqueda reutilizable (id + nombre + descripción)
  const {
      query: queryId,
      filteredItems: productosFiltrados,
      onChange: onSearchChange,
      clear: clearSearch,
    } = useSearch(productos, (p, q) => {
      const query = q.toLowerCase();

      const id = String(p._id ?? p.id ?? "").toLowerCase();
      const nombre = String(p.nombre ?? p.name ?? "").toLowerCase();
      const descripcion = String(p.descripcion ?? p.description ?? "").toLowerCase();

      // Busca por ID O por nombre O por descripción
      return (
        id.includes(query) ||
        nombre.includes(query) ||
        descripcion.includes(query)
      );
    });
  //fin de hook useSearch
  // 🔹 Cargar productos
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

  // 🔹 Handlers CRUD
  const handleNuevo = () => {
    setProductoSeleccionado(null)
    setMostrandoForm(true)
  }

  const handleEditar = (producto) => {
    setProductoSeleccionado(producto)
    setMostrandoForm(true)
  }

  // Buscador por ID (local sobre productos cargados)
  const handleSearchChange = (e) => {
    setQueryId(e.target.value)
    if (!e.target.value) setFilteredProductos(null)
  }

  const handleSearch = (e) => {
    e && e.preventDefault()
    const q = queryId.trim()
    if (!q) {
      setFilteredProductos(null)
      return
    }
    const found = productos.filter(p => String(p._id || p.id || '').includes(q))
    if (found.length === 0) {
      alert('No se encontró producto con ese id')
      setFilteredProductos([])
      return
    }
    setFilteredProductos(found)
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

  const handleEliminarClick = (id) => {
    setIdAEliminar(id)
  }

  const confirmarEliminar = async () => {
    try {
      await productService.delete(idAEliminar) // ✅ usamos el método delete
      setIdAEliminar(null)
      cargarProductos()
    } catch {
      alert('No se pudo eliminar el producto')
    }
  }

  // 🔹 Renderizado condicional
  if (loading) return <p>Cargando productos...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="dashboard-page">
      
      <div className="dashboard-actions">
        {/* 🔍 Buscador global (id + nombre + descripción) */}
        <form
          className="search-form"
          onSubmit={(e) => e.preventDefault()} // búsqueda en tiempo real
        >
          <input
            placeholder="Buscar productos..."
            value={queryId}
            onChange={onSearchChange}
            className="search-input"
          />
          <button
            type="button"
            className="search-clear"
            onClick={clearSearch}
          >
            Limpiar
          </button>
        </form>

        <button onClick={handleNuevo} className="btn-primary btn-add">
          <BiPlus style={{ marginRight: 8 }} /> Nuevo producto
        </button>
      </div>
      {/* 
      <div className="dashboard-actions">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            placeholder="Buscar por id..."
            value={queryId}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-btn">Buscar</button>
          <button type="button" className="search-clear" onClick={() => { setQueryId(''); setFilteredProductos(null); }}>Limpiar</button>
        </form>

        <button onClick={handleNuevo} className="btn-primary btn-add">
          <BiPlus style={{ marginRight: 8 }} /> Nuevo producto
        </button>
      </div>*/}

      <Card
    //     productos={filteredProductos ?? productos}
        productos={productosFiltrados}
        onEdit={handleEditar}
        onDelete={handleEliminarClick}
      />

      {/* 🔹 Formulario de producto: ProductForm maneja su propio overlay cuando `open` es true */}
      <ProductoForm
        open={mostrandoForm}
        productoSeleccionado={productoSeleccionado}
        onClose={handleCerrarForm}
        onSaved={handleGuardado}
      />

      {/* 🔹 Confirmación de eliminación usando Modal reutilizable */}
      <Modal
        open={!!idAEliminar}
        title="Confirmar eliminación"
        onClose={() => setIdAEliminar(null)}
        onConfirm={confirmarEliminar}
        confirmText="Sí, eliminar"
        showCancel={true}
      >
        <div>
          <p>¿Seguro que quieres eliminar este producto?</p>
        </div>
      </Modal>
    </div>
  )
}

export default DashboardPage
