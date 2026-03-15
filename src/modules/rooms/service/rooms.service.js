import api from '../../../api/config';

export const roomsService = {
  //  Obtener todos los Rooms
  async getAll() {
    const { data } = await api.get('/Room/listar');
    return data.data || [];
  },

  //  Crear Room
  async create(Room) {
    const { data } = await api.post('/Room/guardarRegistro', Room);
    return data;
  },

  //  Actualizar Room
  async update(id, Room) {
    const { data } = await api.patch(`/Room/actualizar/${id}`, Room);
    return data;
  },

  //  Eliminar Room
  async delete(id) {
    const { data } = await api.delete(`/Room/eliminar/${id}`);
    return data;
  },
};
