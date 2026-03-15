import api from '../../../api/config';

export const rentService = {
  //  Obtener todos los rentaes
  async getAll() {
    const { data } = await api.get('/renta/listar');
    return data.data || [];
  },

  //  Crear renta
  async create(renta) {
    const { data } = await api.post('/renta/guardarRegistro', renta);
    return data;
  },

  //  Actualizar renta
  async update(id, renta) {
    const { data } = await api.patch(`/renta/actualizar/${id}`, renta);
    return data;
  },

  //  Eliminar renta
  async delete(id) {
    const { data } = await api.delete(`/renta/eliminar/${id}`);
    return data;
  },
};
