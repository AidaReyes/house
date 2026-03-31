import api from '../../../api/config';

export const rentService = {
  //  Obtener todos los Rentas
  async getAll() {
    const { data } = await api.get('/rentas/listar');
    return data.data || [];
  },

  //  Obtener Renta por ID
  async getById(id) {
    const { data } = await api.get(`/rentas/buscarid/${id}`);
    return data.data;
  },

  //  Crear Rentas
  async create(Rentas) {
    const { data } = await api.post('/rentas/guardarRegistro', Rentas);
    return data;
  },

  //  Actualizar Rentas
  async update(id, Rentas) {
    const { data } = await api.patch(`/rentas/actualizar/${id}`, Rentas);
    return data;
  },

  // Eliminar renta
  async delete(id) {
    const { data } = await api.delete(`/rentas/eliminar/${id}`);
    return data;
  },
};