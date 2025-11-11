//FORMULARIO EN SI, DE CREAR
import { useEffect, useState } from "react";
import { createProducto, updateProducto } from "../apis/productosApi";


const ProductoForm = ({ productoSeleccionado, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    fechacaducidad: "",
    fechadecompra: "",
    Imagen: "",
    stock: "",
    provedoor: "",
  });

  // si me mandan un producto lo cargo para editar
  useEffect(() => {
    if (productoSeleccionado) {
      setFormData({
        nombre: productoSeleccionado.nombre || "",
        descripcion: productoSeleccionado.descripcion || "",
        precio: productoSeleccionado.precio || "",
        fechacaducidad: productoSeleccionado.fechacaducidad || "",
        fechadecompra: productoSeleccionado.fechadecompra || "",
        Imagen: productoSeleccionado.Imagen || "",
        stock: productoSeleccionado.stock || "",
        provedoor: productoSeleccionado.provedoor || "",
      });
    }
  }, [productoSeleccionado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.descripcion ||
      !formData.precio ||
      !formData.fechacaducidad ||
      !formData.fechadecompra ||
      !formData.Imagen ||
      !formData.stock ||
      !formData.provedoor
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      if (productoSeleccionado && productoSeleccionado._id) {
        // EDITAR
        await updateProducto(productoSeleccionado._id, formData);
      } else {
        // CREAR
        await createProducto(formData);
      }
      onSaved && onSaved();   // cargar la lista
      onClose && onClose();   
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar el producto");
    }
  };

  return (
    <div style={{ background: "#fff", padding: "1rem", borderRadius: "10px", boxShadow: "0 4px 10px #0001" }}>
      <h3>{productoSeleccionado ? "Editar producto" : "Nuevo producto"}</h3>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: ".6rem" }}>
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" />
        <input name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" />
        <input name="precio" type="number" value={formData.precio} onChange={handleChange} placeholder="Precio" />
        <label>Fecha de caducidad</label>
        <input name="fechacaducidad" type="date" value={formData.fechacaducidad} onChange={handleChange} />
        <label>Fecha de compra</label>
        <input name="fechadecompra" type="date" value={formData.fechadecompra} onChange={handleChange} />
        <input name="Imagen" value={formData.Imagen} onChange={handleChange} placeholder="URL de imagen" />
        <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" />
        <input name="provedoor" value={formData.provedoor} onChange={handleChange} placeholder="ID proveedor" />
        <div style={{ display: "flex", gap: ".5rem" }}>
          <button type="submit">
            {productoSeleccionado ? "Actualizar" : "Guardar"}
          </button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductoForm;
