import api from '../../../api/config';

export const roomsService = {

  // 🔹 Obtener todos (sin filtros)
  async getAll() {
    const { data } = await api.get('/Room/listar');
    return data.data || [];
  },

  // 🔹 Obtener con filtros (🔥 ESTE ES EL IMPORTANTE)
  async getFiltered(params = {}) {
    const query = new URLSearchParams(params).toString();
    const { data } = await api.get(`/Room/listar?${query}`);
    return data.data || [];
  },

  // 🔹 Obtener solo publicados
  async getPublished() {
    return this.getFiltered({ publicado: true });
  },

  // 🔹 Obtener disponibles
  async getAvailable() {
    return this.getFiltered({ estado: "disponible" });
  },

  // 🔹 Obtener publicados y disponibles (CATÁLOGO)
  async getCatalog() {
    return this.getFiltered({
      publicado: true,
      estado: "disponible"
    });
  },

  // 🔹 Obtener por propietario (manual)
  async getByOwner(propietarioId) {
    return this.getFiltered({ propietario: propietarioId });
  },

  // 🔹 Obtener MIS cuartos (usuario autenticado)
  async getMyRooms() {
    const { data } = await api.get('/Room/mis-cuartos');
    return data.data || [];
  },

  // 🔹 Crear Room
  async create(room) {
    const { data } = await api.post('/Room/guardarRegistro', room);
    return data;
  },

  // 🔹 Actualizar Room
  async update(id, room) {
    const { data } = await api.patch(`/Room/actualizar/${id}`, room);
    return data;
  },

  // 🔹 Eliminar Room
  async delete(id) {
    const { data } = await api.delete(`/Room/eliminar/${id}`);
    return data;
  },
};