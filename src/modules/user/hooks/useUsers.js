import { useEffect, useState } from "react";
import { userService } from "../service/user.service";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ⭐ Crear usuario
  const createUser = async (userData) => {
    try {
      const newUser = await userService.create(userData);
      setUsers(prev => [...prev, newUser]);
      await fetchUsers(); // vuelve a cargar todos desde BD

    } catch (err) {
      console.error("Error creando usuario", err);
    }
  };

  // ⭐ Actualizar usuario
  const updateUser = async (id, userData) => {
    try {
      const updated = await userService.update(id, userData);
      setUsers(prev => prev.map(u => (u.id === id ? updated : u)));
      await fetchUsers(); // vuelve a cargar todos desde BD

    } catch (err) {
      console.error("Error actualizando usuario", err);
    }
  };

  // ⭐ Eliminar usuario
  const deleteUser = async (id) => {
    try {
      await userService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error("Error eliminando usuario", err);
    }
  };

  return {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser,
  };
};
