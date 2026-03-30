import api from '../../../api/config';

export const solicitudService = {
  async getAll() {
    const { data } = await api.get('/solicitudes/listar');
    return data.data || [];
  },
  async create(solicitud) {
    const { data } = await api.post('/solicitudes/guardar', solicitud);
    return data;
  },
  async update(id, solicitud) {
    const { data } = await api.patch(`/solicitudes/actualizar/${id}`, solicitud);
    return data;
  },
  async delete(id) {
    const { data } = await api.delete(`/solicitudes/eliminar/${id}`);
    return data;
  },
};