import api from '../../../api/config';

export const rentService = {
  //  Obtener todos los Rentases
  async getAll() {
    const { data } = await api.get('/rentas');
    return data.data || [];
  },

  //  Crear Rentas
  async create(Rentas) {
    const { data } = await api.post('/rentas/', Rentas);
    return data;
  },

  //  Actualizar Rentas
  async update(id, Rentas) {
    const { data } = await api.patch(`/rentas/${id}`, Rentas);
    return data;
  },

  //  Eliminar Rentas
  async delete(id) {
    const { data } = await api.delete(`/rentas/${id}`);
    return data;
  },
};
