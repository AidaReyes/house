// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [permisos, setPermisos] = useState([]); // 👈 permisos del usuario
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setPermisos(parsedUser?.permisos || []); // 👈 recuperamos permisos
      }

      if (storedToken) {
        setToken(storedToken);
      }
    } catch (e) {
      console.error("Error leyendo auth de localStorage", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Espera que le pases { user, token } desde el servicio de login
  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);
    setPermisos(user?.permisos || []);

    try {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (e) {
      console.error("Error guardando auth en localStorage", e);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPermisos([]);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const hasPermission = (permiso) => {
    return permisos.includes(permiso);
  };

  const updateProfile = async (updated) => {
    try {
      if (user && user.id) {
        const res = await (
          await import("../modules/user/service/user.service")
        ).userService.update(user.id, updated);

        // mantenemos permisos actuales salvo que el backend devuelva otros
        const next = {
          ...user,
          ...res,
          permisos: res?.permisos || user.permisos || [],
        };

        setUser(next);
        setPermisos(next.permisos || []);

        localStorage.setItem("user", JSON.stringify(next));
        return next;
      }
    } catch (e) {
      console.error("Profile update failed", e);
    }

    const next = { ...user, ...updated };
    setUser(next);
    try {
      localStorage.setItem("user", JSON.stringify(next));
    } catch (e) {}
    return next;
  };

  const deleteAccount = async () => {
    try {
      if (!user?.id) throw new Error("No user");
      await (
        await import("../modules/user/service/user.service")
      ).userService.delete(user.id);
    } catch (e) {
      console.error("delete account failed", e);
    }
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permisos,
        loading,
        login,
        logout,
        hasPermission,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
