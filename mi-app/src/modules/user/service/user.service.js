import api from "../../../api/config";
import { User } from "../models/user.model";

export const userService = {
  getAll: async () => {
    const { data } = await api.get("/usuarios/listar");
    return data.data.map(u => User.fromApi(u));
  },

  getById: async (id) => {
    const { data } = await api.get(`/usuarios/buscarid/${id}`);
    return User.fromApi(data.data);
  },

  create: async (usuario) => {
    const { data } = await api.post("/usuarios/registrar", usuario);
    return User.fromApi(data.data);
  },

  update: async (id, usuario) => {
    const { data } = await api.patch(`/usuarios/actualizar/${id}`, usuario);
    return User.fromApi(data.data);
  },

  delete: async (id) => {
    await api.delete(`/usuarios/eliminar/${id}`);
  }
};
