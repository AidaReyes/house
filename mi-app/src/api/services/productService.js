// src/api/services/productService.js
import api from '../config';

export const productService = {
  // Obtener todos los productos
  async getAll() {
    const { data } = await api.get('/productos/listar');
    return data.data || [];
  },

  // Crear nuevo producto
  async create(producto) {
    const { data } = await api.post('/productos/guardarRegistro', producto);
    return data;
  },

  // Actualizar producto existente
  async update(id, producto) {
    const { data } = await api.patch(`/productos/actualizar/${id}`, producto);
    return data;
  },

  // Eliminar producto por ID
  async delete(id) {
    const { data } = await api.delete(`/productos/eliminar/${id}`);
    return data;
  },
};
