import api from '../../../api/config';

export const rentService = {
  //  Obtener todos los Rentases
  async getAll() {
    const { data } = await api.get('/Rentas/listar');
    return data.data || [];
  },

  //  Crear Rentas
  async create(Rentas) {
    const { data } = await api.post('/Rentas/guardarRegistro', Rentas);
    return data;
  },

  //  Actualizar Rentas
  async update(id, Rentas) {
    const { data } = await api.patch(`/Rentas/actualizar/${id}`, Rentas);
    return data;
  },

  //  Eliminar Rentas
  async delete(id) {
    const { data } = await api.delete(`/Rentas/eliminar/${id}`);
    return data;
  },
};
