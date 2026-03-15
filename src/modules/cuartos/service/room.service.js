import api from "../../../api/config";

export const roomService = {

  getAll: async () => {
    const { data } = await api.get("/Room/listar");
    return data;
  },

  create: async (room) => {
    const { data } = await api.post("/Room/guardarRegistro", room);
    return data;
  },

  update: async (id, room) => {
    const { data } = await api.patch(`/Room/actualizar/${id}`, room);
    return data;
  },

  delete: async (id) => {
    await api.delete(`/Room/eliminar/${id}`);
  }

};