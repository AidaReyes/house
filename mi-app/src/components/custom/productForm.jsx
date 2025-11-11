// ...existing code...
import { useEffect, useState } from "react";
import { productService } from "../../api/services/productService";
import './productForm.css';

const ProductForm = ({ open = false, productoSeleccionado, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    fechaCaducidad: "",
    fechaCompra: "",
    imagen: "",
    stock: "",
    proveedor: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productoSeleccionado) {
      setFormData({
        nombre: productoSeleccionado.nombre || "",
        descripcion: productoSeleccionado.descripcion || "",
        precio: productoSeleccionado.precio ?? "",
        fechaCaducidad: productoSeleccionado.fechacaducidad || "",
        fechaCompra: productoSeleccionado.fechadecompra || "",
        imagen: productoSeleccionado.imagen || productoSeleccionado.Imagen || "",
        stock: productoSeleccionado.stock ?? "",
        proveedor: productoSeleccionado.proveedor || productoSeleccionado.provedoor || "",
      });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        fechaCaducidad: "",
        fechaCompra: "",
        imagen: "",
        stock: "",
        proveedor: "",
      });
    }
  }, [productoSeleccionado, open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose && onClose(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validación mínima
    if (!formData.nombre.trim() || formData.precio === "") {
      return alert("Nombre y precio son obligatorios");
    }

    // validación mínima en cliente: comprobar campos que el backend marca como obligatorios
    // El backend espera: nombre, descripcion, precio, fechacaducidad, fechadecompra, Imagen, stock, provedoor
    const mappedPayload = {
      // conservar nombres internos y mapear después
      nombre: formData.nombre && formData.nombre.trim() ? formData.nombre.trim() : undefined,
      descripcion: formData.descripcion && formData.descripcion.trim() ? formData.descripcion.trim() : undefined,
      // números
      precio: formData.precio === "" ? undefined : parseFloat(formData.precio),
      stock: formData.stock === "" ? undefined : parseInt(formData.stock, 10),
      // fechas: el backend espera campos en minúsculas sin camelCase
      fechacaducidad: formData.fechaCaducidad || undefined,
      fechadecompra: formData.fechaCompra || undefined,
      // imagen y proveedor: mapear a los nombres que el backend valida
      Imagen: formData.imagen || undefined,
      provedoor: formData.proveedor || undefined,
    };

    // Validar que no falten campos obligatorios antes de enviar
    const required = ['nombre','descripcion','precio','fechacaducidad','fechadecompra','Imagen','stock','provedoor'];
    const missing = required.filter(k => mappedPayload[k] === undefined || mappedPayload[k] === '' || Number.isNaN(mappedPayload[k]));
    if (missing.length > 0) {
      alert('Faltan campos obligatorios: ' + missing.join(', '));
      console.warn('Validación cliente - campos faltantes:', missing, 'payload:', mappedPayload);
      return;
    }

    // DEBUG: mostrar payload final que se enviará al backend
    console.log('Enviando payload producto (mapeado a backend):', mappedPayload);

    setLoading(true);
    try {
      if (productoSeleccionado && productoSeleccionado._id) {
        // en actualización enviamos solo los campos mapeados permitidos
        await productService.update(productoSeleccionado._id, mappedPayload);
      } else {
        await productService.create(mappedPayload);
      }
      onSaved && onSaved();
      onClose && onClose();
    } catch (err) {
      // Mostrar información útil del error devuelto por el servidor (si existe)
      console.error('Error al guardar producto:', err);
      if (err.response && err.response.data) {
        console.error('Respuesta del servidor:', err.response.data);
        // Si el backend envía { message } o similar, mostrarlo
        const serverMessage = err.response.data.message || JSON.stringify(err.response.data);
        alert('Error del servidor: ' + serverMessage);
      } else {
        alert('Error al guardar (sin respuesta del servidor). Revisa la consola.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="pf-modal-overlay" role="dialog" aria-modal="true" aria-label="Formulario producto">
      <div className="pf-modal">
        <header className="pf-header">
          <h3>{productoSeleccionado ? "Editar producto" : "Nuevo producto"}</h3>
          <button className="pf-close" onClick={onClose} aria-label="Cerrar">×</button>
        </header>

        <form className="pf-form" onSubmit={handleSubmit}>
          <div className="pf-row">
            <label>
              Nombre
              <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" />
            </label>

            <label>
              Precio
              <input name="precio" type="number" step="0.01" value={formData.precio} onChange={handleChange} placeholder="Precio" />
            </label>
          </div>

          <label>
            Descripción
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción breve" rows={3} />
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
              <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" />
            </label>

            <label>
              Proveedor
              <input name="proveedor" value={formData.proveedor} onChange={handleChange} placeholder="ID o nombre proveedor" />
            </label>
          </div>

          <label>
            URL imagen
            <input name="imagen" value={formData.imagen} onChange={handleChange} placeholder="https://..." />
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
    </div>
  );
};

export default ProductForm;