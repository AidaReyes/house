import { useState } from "react";
import { authService } from "../../service/auth.service";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (nombre, usuario, password) => {
    setLoading(true);
    setError(null);

    try {
      const user = await authService.register(nombre, usuario, password);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar usuario");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
