// src/services/productosService.js
import { getProductos } from '../apis/productosApi.jsx';

export const obtenerProductosAdaptados = async () => {
  try {
    const res = await getProductos();
    const productos = res.data || [];

    return productos.map(p => ({
      id: p._id,
      titulo: p.nombre,
      descripcion: p.descripcion,
      imagen: p.Imagen,
      stock: p.stock,
      precioVenta: p.precio,
      fechaCaducidad: p.fechacaducidad?.split('T')[0],
      fechaCompra: p.fechadecompra?.split('T')[0],
      proveedor: p.provedoor,
      precioCompra: p.precio
    }));
  } catch (error) {
    console.error('Error en productosService:', error);
    throw error;
  }
};
