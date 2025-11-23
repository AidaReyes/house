import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 NUEVO

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false); // 👈 YA TERMINÓ DE CARGAR
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  
  const updateProfile = async (updated) => {
    try {
      if (user && user.id) {
        const res = await (await import('../modules/user/service/user.service')).userService.update(user.id, updated);
        const next = { ...user, ...res };
        setUser(next);
        localStorage.setItem('user', JSON.stringify(next));
        return next;
      }
    } catch (e) {
      console.error('Profile update failed', e);
    }
    const next = { ...user, ...updated };
    setUser(next);
    try { localStorage.setItem('user', JSON.stringify(next)); } catch (e) {}
    return next;
  };
  
  const deleteAccount = async () => {
    try {
      if (!user?.id) throw new Error('No user');
      await (await import('../modules/user/service/user.service')).userService.delete(user.id);
    } catch (e) {
      console.error('delete account failed', e);
    }
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
