import api from "../../../api/config";
import { User } from "../models/user.model";

export const authService = {
  login: async (usuario, password) => {
    const { data } = await api.post("/usuarios/login", {
      usuario,
      password,
    });

    return User.fromApi(data.data);
  },

  register: async (nombre, usuario, password) => {
    const { data } = await api.post("/usuarios/registrar", {
      nombre,
      usuario,
      password,
    });

    return data.data;
  },
};
