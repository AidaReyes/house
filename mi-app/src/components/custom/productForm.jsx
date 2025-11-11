// src/components/custom/ProductForm.jsx
import React, { useState } from 'react';
import './productForm.css';
import { useProductForm } from './useProductForm';
import Modal from '../ui/Modal';

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
          </div>

          <label>
            Descripción
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} />
          </label>

          <div className="pf-row">
            <label>
              Fecha compra
              <input name="fechaCompra" type="date" value={formData.fechaCompra} onChange={handleChange} />
            </label>
            <label>
              Fecha caducidad
              <input name="fechaCaducidad" type="date" value={formData.fechaCaducidad} onChange={handleChange} />
            </label>
          </div>

          <div className="pf-row">
            <label>
              Stock
              <input name="stock" type="number" value={formData.stock} onChange={handleChange} />
            </label>
            <label>
              Proveedor
              <input name="proveedor" value={formData.proveedor} onChange={handleChange} />
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
