import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import ProductoForm from '../components/productForm'
import { productService } from '../service/productService'
import Modal from '../components/Modal'
import { BiPlus } from 'react-icons/bi'
import './productStyle.css'

import { useSearch } from "../hooks/useSearch";
import { useAuth } from '../../../context/AuthContext';

const DashboardPage = () => {
  const [productos, setProductos] = useState([])
  const [filteredProductos, setFilteredProductos] = useState(null)
  // const [queryId, setQueryId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [mostrandoForm, setMostrandoForm] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  const [idAEliminar, setIdAEliminar] = useState(null)

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

  const { user } = useAuth();
  const role = user?.rol;

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

  // BUSCADOR
 
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

  // ELIMINAR
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
      <div className="dashboard__actions">

        <form
          className="search"
          onSubmit={(e) => e.preventDefault()} 
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

        {role !== 'cajero' && (
          <button className="btn-primary" onClick={handleNuevo}>
            <BiPlus size={20} /> Nuevo producto
          </button>
        )}
      </div>

      <Card
        productos={productosFiltrados}
        onEdit={handleEditar}
        onDelete={handleEliminarClick}
      />

      <ProductoForm
        open={mostrandoForm}
        productoSeleccionado={productoSeleccionado}
        onClose={handleCerrarForm}
        onSaved={handleGuardado}
      />

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