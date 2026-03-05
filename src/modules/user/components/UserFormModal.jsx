import React, { useState, useEffect } from "react";
import "./components.css";
import { rolService } from "../../role/service/rolService";

const UserFormModal = ({ isOpen, onClose, onSubmit, user }) => {

  const [rolesList, setRolesList] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    password: "",
    roles: ""
  });

  // 🔹 1) Cargar roles desde backend
  useEffect(() => {
    rolService.getAll()
      .then(list => setRolesList(list || []))
      .catch(err => console.error("Error al cargar roles", err));
  }, []);

  // 🔹 2) Rellenar form cuando haya roles + user
  useEffect(() => {
    if (!rolesList.length) return;

    if (user) {
      setForm({
        nombre: user.nombre || "",
        usuario: user.usuario || "",
        password: "",
        roles: user.roles?._id || user.roles || ""
      });
    } else {
      setForm({
        nombre: "",
        usuario: "",
        password: "",
        roles: ""
      });
    }
  }, [user, rolesList]);

  // 🔹 Manejo de cambios
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Enviar datos limpios
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {};

    // Solo enviar lo que backend acepta
    if (form.nombre.trim() !== "") payload.nombre = form.nombre;
    if (form.usuario.trim() !== "") payload.usuario = form.usuario;

    // En edición NO mandar password vacío
    if (form.password.trim() !== "") payload.password = form.password;

    // Solo enviar el rol si hay uno seleccionado
    if (form.roles.trim() !== "") payload.roles = form.roles;

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

          <label>Correo Electrónico</label>
          <input
            type="email"
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder={user ? "Dejar vacío si no deseas cambiarla" : ""}
            value={form.password}
            onChange={handleChange}
          />

          <label>Rol del sistema</label>
          <select
            name="roles"
            value={form.roles}
            onChange={handleChange}
          >
            <option value="">-- Seleccione un rol --</option>
            {rolesList.map((r) => (
              <option key={r._id} value={r._id}>
                {r.nombre}
              </option>
            ))}
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

