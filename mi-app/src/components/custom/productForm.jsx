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

    const payload = {
      ...formData,
      precio: formData.precio === "" ? undefined : parseFloat(formData.precio),
      stock: formData.stock === "" ? undefined : parseInt(formData.stock, 10),
    };

    setLoading(true);
    try {
      if (productoSeleccionado && productoSeleccionado._id) {
        await productService.update(productoSeleccionado._id, payload);
      } else {
        await productService.create(payload);
      }
      onSaved && onSaved();
      onClose && onClose();
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
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