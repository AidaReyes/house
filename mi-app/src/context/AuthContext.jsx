import { createContext, useContext, useState, useEffect } from "react";
import { attachInterceptors } from "../api/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    setPermisos([]);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const logoutWithAlert = (message = "Tu sesión ha expirado") => {
    alert(message);
    logout();
    window.location.href = "/"; // Redirige al login o inicio
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setPermisos(parsedUser?.permisos || []);
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

  // 🔥 Aquí ya funciona perfectamente
  useEffect(() => {
    attachInterceptors(logoutWithAlert);
  }, []);

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

  const hasPermission = (permiso) => permisos.includes(permiso);

  const updateProfile = async (updated) => {
    try {
      if (user && user.id) {
        const res = await (
          await import("../modules/user/service/user.service")
        ).userService.update(user.id, updated);

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
    localStorage.setItem("user", JSON.stringify(next));
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
