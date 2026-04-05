import api from "../../../api/config";

export const rentService = {
  // Obtener rentas con filtro por tipo y opcionalmente por status
  async getAll({ tipo = "todos", status = "" } = {}) {
    let url = `/rentas/listar?tipo=${tipo}`;

    if (status) {
      url += `&status=${status}`;
    }

    const { data } = await api.get(url);
    return data.data || [];
  },

  // Obtener renta por ID
  async getById(id) {
    const { data } = await api.get(`/rentas/buscarid/${id}`);
    return data.data;
  },

  // Crear renta / solicitud
  async create(renta) {
    const { data } = await api.post("/rentas/guardarRegistro", renta);
    return data;
  },

  // Actualizar renta
  async update(id, renta) {
    const { data } = await api.patch(`/rentas/actualizar/${id}`, renta);
    return data;
  },

  // Eliminar renta
  async delete(id) {
    const { data } = await api.delete(`/rentas/eliminar/${id}`);
    return data;
  },
};