import api from '../../../api/config';

export const rentService = {
  // Obtener todas las rentas
  async getAll() {
    const { data } = await api.get('/Rentas/listar');
    return data.data || [];
  },

  // Crear renta
  async create(renta) {
    const { data } = await api.post('/Rentas/guardarRegistro', renta);
    return data;
  },

  // Actualizar renta
  async update(id, renta) {
    const { data } = await api.patch(`/Rentas/actualizar/${id}`, renta);
    return data;
  },

  // Eliminar renta
  async delete(id) {
    const { data } = await api.delete(`/Rentas/eliminar/${id}`);
    return data;
  },

  // Buscar por id
  async getById(id) {
    const { data } = await api.get(`/Rentas/buscarid/${id}`);
    return data.data;
  },
};