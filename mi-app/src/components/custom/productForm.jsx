// src/components/custom/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import './productForm.css';
import { useProductForm } from '../../hook/useProductForm';
import Modal from '../ui/Modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";


registerLocale("es", es);

const ProductForm = ({ open = false, productoSeleccionado, onClose, onSaved }) => {
  const [modalState, setModalState] = useState({ open: false, title: '', content: null, showCancel: false, confirmText: 'OK', onConfirm: null });

  const showModal = ({ title = '', content = null, showCancel = false, confirmText = 'OK', onConfirm = null }) => {
    setModalState({ open: true, title, content, showCancel, confirmText, onConfirm });
  };

  const closeModal = () => setModalState((s) => ({ ...s, open: false }));

  const { formData, handleChange, handleSubmit, loading } = useProductForm({
    productoSeleccionado,
    open,
    onClose,
    onSaved,
    showModal,
  });

  // cargar proveedores para el select (import dinámico para evitar dependencias cíclicas)
  const [providers, setProviders] = useState([])
  useEffect(() => {
    let mounted = true
    import('../../api/services/providerService')
      .then((mod) => mod.providerService.getAll())
      .then((list) => { if (mounted) setProviders(list || []) })
      .catch((e) => console.error('No se pudo cargar lista de proveedores', e))
    return () => { mounted = false }
  }, [])

  // Si estamos editando y el proveedor del producto no está en la lista cargada, añádelo temporalmente
  useEffect(() => {
    if (!productoSeleccionado) return
    const p = productoSeleccionado.proveedor ?? productoSeleccionado.provedoor
    if (!p) return
    const id = typeof p === 'object' ? (p._id || p.id) : p
    const nombre = typeof p === 'object' ? (p.nombre || '') : ''
    if (!id) return
    if (!providers.find(pr => (pr._id || pr.id) === id)) {
      setProviders((prev) => [{ _id: id, nombre: nombre || id }, ...prev])
    }
  }, [productoSeleccionado, providers])

  // When this modal is open, prevent background (body) from scrolling on mobile
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; }
  }, [open])

  if (!open) return null;

  return (
    <div className="pf-modal-overlay" role="dialog" aria-modal="true">
      <div className="pf-modal">
        <header className="pf-header">
          <h3>{productoSeleccionado ? "Editar producto" : "Nuevo producto"}</h3>
          <button className="pf-close" onClick={onClose}>×</button>
        </header>

        <form className="pf-form" onSubmit={handleSubmit}>
          <div className="pf-row">
            <label>
              Nombre
              <input name="nombre" value={formData.nombre} onChange={handleChange} />
            </label>
            <label>
              Precio
              <input name="precio" type="number" step="0.01" value={formData.precio} onChange={handleChange} />
            </label>
            <label>
              Precio de compra
              <input name="precioDeCompra" type="number" step="0.01" value={formData.precioDeCompra} onChange={handleChange} />
            </label>
          </div>
          <div className="col-md-12">
            <label>
              Descripción
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} />
            </label>
          </div>

          <div className="pf-row">
              <div className="pf-row">
            <label>
              Fecha compra
              <DatePicker
                selected={formData.fechaCompra ? new Date(formData.fechaCompra) : null}
                onChange={(date) => handleChange({ target: { name: "fechaCompra", value: date } })}
                dateFormat="dd/MM/yyyy"
                  locale="es"
                className="custom-date-input"
                placeholderText="Selecciona una fecha"
              />
            </label>
            </div>
            <div className="pf-row">
            <label>
              Fecha caducidad
              <DatePicker
                selected={formData.fechaCaducidad ? new Date(formData.fechaCaducidad) : null}
                onChange={(date) => handleChange({ target: { name: "fechaCaducidad", value: date } })}
                dateFormat="dd/MM/yyyy"
                  locale="es"
                className="custom-date-input"
                placeholderText="Selecciona una fecha"
              />
            </label>
            </div>
          </div>


          <div className="pf-row">
            <label>
              Stock
              <input name="stock" type="number" value={formData.stock} onChange={handleChange} />
            </label>
            <label>
              Proveedor
              <select name="proveedor" value={formData.proveedor} onChange={handleChange}>
                <option value="">-- Seleccione proveedor --</option>
                {providers.map((pr) => (
                  <option key={pr._id || pr.id} value={pr._id || pr.id}>{pr.nombre}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            URL imagen
            <input name="imagen" value={formData.imagen} onChange={handleChange} />
          </label>

          {formData.imagen && (
            <div className="pf-preview">
              <img src={formData.imagen} alt="preview" />
            </div>
          )}

          <footer className="pf-actions">
            <button type="button" className="btn ghost" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Guardando..." : productoSeleccionado ? "Actualizar" : "Guardar"}
            </button>
          </footer>
        </form>
      </div>
      <Modal
        open={modalState.open}
        title={modalState.title}
        onClose={closeModal}
        onConfirm={() => {
          if (modalState.onConfirm) modalState.onConfirm()
          closeModal()
        }}
        confirmText={modalState.confirmText}
        showCancel={modalState.showCancel}
      >
        {/* Renderizado inteligente del contenido recibido: puede ser array (missing fields) o string */}
        {Array.isArray(modalState.content) ? (
          <div>
            <p>Faltan los siguientes campos obligatorios:</p>
            <ul>
              {modalState.content.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        ) : typeof modalState.content === 'string' ? (
          <div>
            <p>{modalState.content}</p>
          </div>
        ) : (
          modalState.content
        )}
      </Modal>
    </div>
  );
};

export default ProductForm;
