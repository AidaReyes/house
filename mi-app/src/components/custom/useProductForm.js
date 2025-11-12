// src/components/custom/useProductForm.js
import { useEffect, useState } from "react";

// Helper: convertir cadena ISO (o fecha) a valor aceptado por input[type=date] (YYYY-MM-DD)
function toDateInputValue(d) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}
import { productService } from "../../api/services/productService";

export function useProductForm({ productoSeleccionado, open, onClose, onSaved, showModal }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precioDeCompra: "",
    fechaCaducidad: "",
    fechaCompra: "",
    imagen: "",
    stock: "",
    proveedor: "",
  });
  const [loading, setLoading] = useState(false);

  // Cargar producto seleccionado
  useEffect(() => {
    if (productoSeleccionado) {
      setFormData({
        nombre: productoSeleccionado.nombre || "",
        descripcion: productoSeleccionado.descripcion || "",
        precio: productoSeleccionado.precio ?? "",
        precioDeCompra: productoSeleccionado.precioDeCompra ?? productoSeleccionado.precioCompra ?? "",
        // convertir fecha ISO a YYYY-MM-DD para input[type=date]
        fechaCaducidad: toDateInputValue(productoSeleccionado.fechacaducidad || ""),
        fechaCompra: toDateInputValue(productoSeleccionado.fechadecompra || ""),
        imagen: productoSeleccionado.imagen || productoSeleccionado.Imagen || "",
        stock: productoSeleccionado.stock ?? "",
        // productoSeleccionado.proveedor puede ser un string (id) o un objeto anidado { _id, nombre }
        proveedor: (() => {
          const p = productoSeleccionado.proveedor ?? productoSeleccionado.provedoor ?? ''
          if (!p) return ''
          if (typeof p === 'object') return p._id || p.id || p.nombre || ''
          return p
        })(),
      });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        precioDeCompra: "",
        fechaCaducidad: "",
        fechaCompra: "",
        imagen: "",
        stock: "",
        proveedor: "",
      });
    }
  }, [productoSeleccionado, open]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Manejar cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const mappedPayload = {
      nombre: formData.nombre?.trim(),
      descripcion: formData.descripcion?.trim(),
      precio: formData.precio ? parseFloat(formData.precio) : undefined,
      precioDeCompra: formData.precioDeCompra ? parseFloat(formData.precioDeCompra) : undefined,
      stock: formData.stock ? parseInt(formData.stock, 10) : undefined,
      // convertir YYYY-MM-DD -> ISO antes de enviar
      fechacaducidad: formData.fechaCaducidad ? new Date(formData.fechaCaducidad).toISOString() : undefined,
      fechadecompra: formData.fechaCompra ? new Date(formData.fechaCompra).toISOString() : undefined,
      Imagen: formData.imagen,
      provedoor: formData.proveedor,
    };

    const required = ["nombre", "descripcion", "precio", "fechacaducidad", "fechadecompra", "Imagen", "stock", "provedoor"];
    const missing = required.filter(
      (k) => mappedPayload[k] === undefined || mappedPayload[k] === "" || Number.isNaN(mappedPayload[k])
    );
    if (missing.length > 0) {
      const message = "Faltan campos obligatorios: " + missing.join(", ")
      if (typeof showModal === 'function') {
        // Enviar un array simple al modal para que el componente que lo renderiza
        // (ProductForm) construya la UI con JSX (evitamos JSX dentro de este .js).
        showModal({
          title: 'Campos faltantes',
          content: missing,
          showCancel: false,
          confirmText: 'Cerrar',
        })
        return
      }

      alert(message)
      return
    }

    setLoading(true);
    try {
      if (productoSeleccionado?._id) {
        await productService.update(productoSeleccionado._id, mappedPayload);
      } else {
        await productService.create(mappedPayload);
      }
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("Error al guardar:", err);
      const msg = err.response?.data?.message || "Error al guardar el producto.";
      if (typeof showModal === 'function') {
        // enviar texto simple
        showModal({ title: 'Error', content: String(msg), showCancel: false, confirmText: 'Cerrar' })
      } else {
        alert(msg)
      }
    } finally {
      setLoading(false);
    }
  };

  return { formData, handleChange, handleSubmit, loading };
}
