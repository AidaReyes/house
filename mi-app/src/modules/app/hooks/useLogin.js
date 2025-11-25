// src/modules/app/hooks/useLogin.js
import { useState } from "react";
import { authService } from "../../service/auth.service";
import { useAuth } from "../../../context/AuthContext";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login: saveAuth } = useAuth(); // 👈 login del contexto

  const login = async (usuario, password) => {
    setLoading(true);
    setError(null);

    try {
      // authService.login debe devolver { user, token }
      const { user, token } = await authService.login(usuario, password);

      // delegamos todo al contexto
      saveAuth({ user, token });

      return { user, token };
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
