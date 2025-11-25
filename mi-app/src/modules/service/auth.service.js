// src/modules/app/service/auth.service.js
import api from "../../api/config";
import { User } from "../app/models/user.model";

export const authService = {
  login: async (usuario, password) => {
    const { data } = await api.post("/usuarios/login", {
      usuario,
      password,
    });

    // data = { status, message, data: { user, token } }
    const { user, token } = data.data;

    // OJO: asegúrate que User.fromApi NO borre permisos ni roles
    const userModel = User.fromApi(user);

    return { user: userModel, token }; // 👈 esto es lo que espera tu useLogin/AuthContext
  },

  register: async (nombre, usuario, password) => {
    const { data } = await api.post("/usuarios/registrar", {
      nombre,
      usuario,
      password,
    });

    return data.data; // aquí está bien así
  },
};
