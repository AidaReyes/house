// src/modules/users/components/UserFormModal.jsx
import React, { useState, useEffect } from "react";
import './components.css'

const UserFormModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    password: "",
    rol: "cajero",
  });

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre,
        usuario: user.usuario,
        password: "", // no se muestra por seguridad
        rol: user.rol,
      });
    } else {
      // Limpia si es nuevo
      setForm({
        nombre: "",
        usuario: "",
        password: "",
        rol: "cajero",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Si es edición, quitamos el password si está vacío
    const payload = { ...form };
    if (user && form.password.trim() === "") {
      delete payload.password;
    }

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="user-modal-overlay">
      <div className="user-modal">
        <h2>{user ? "Editar Usuario" : "Nuevo Usuario"}</h2>

        <form onSubmit={handleSubmit}>

          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />

          <label>Usuario</label>
          <input
            type="text"
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
          />

          {/* Password SOLO si crea o si lo quiere cambiar */}
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder={user ? "Dejar vacío para no cambiar" : ""}
            value={form.password}
            onChange={handleChange}
          />

          <label>Rol</label>
          <select name="rol" value={form.rol} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="gerente">Gerente</option>
            <option value="cajero">Cajero</option>
          </select>

          <div className="user-modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {user ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
