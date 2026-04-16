import React, { useEffect, useState } from 'react';
import './components.css';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    usuario: '',
    telefono: '',
    whatsapp: '',
    ciudad: '',
    descripcion: '',
    password: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setForm({
        nombre: user.nombre || '',
        usuario: user.usuario || '',
        telefono: user.telefono || '',
        whatsapp: user.whatsapp || '',
        ciudad: user.ciudad || '',
        descripcion: user.descripcion || '',
        password: ''
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim() || !form.usuario.trim()) {
      Swal.fire('Error', 'Nombre y correo son obligatorios', 'warning');
      return;
    }

    setSaving(true);

    const payload = {
      nombre: form.nombre,
      usuario: form.usuario,
      telefono: form.telefono,
      whatsapp: form.whatsapp,
      ciudad: form.ciudad,
      descripcion: form.descripcion
    };

    if (form.password?.trim()) {
      payload.password = form.password;
    }

    try {
      await updateProfile(payload);

      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        timer: 1500,
        showConfirmButton: false
      });

      onClose();
    } catch (err) {
      Swal.fire('Error', 'No se pudo actualizar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar cuenta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    });

    if (!result.isConfirmed) return;

    await deleteAccount();
    navigate('/');
  };

  return (
    <div
      className="profile-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="profile-container">

        {/* 🔥 HEADER */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.nombre?.charAt(0) || 'U'}
          </div>

          <div className="profile-info">
            <h2>{user?.nombre}</h2>
            <p>{user?.rol || 'Usuario'}</p>
            <span>{user?.ciudad}</span>
          </div>
        </div>

        {/* 🔥 STATS */}
        <div className="profile-stats">
          <div className="stat-card">Solicitudes</div>
          <div className="stat-card">Rentas</div>
          <div className="stat-card">Pagos</div>
          <div className="stat-card">Comentarios</div>
        </div>

        {/* 🔥 FORM */}
        <form className="profile-form" onSubmit={handleSubmit}>
          <h3>Información Personal</h3>

          <div className="grid">
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
            <input name="usuario" value={form.usuario} onChange={handleChange} placeholder="Correo" />
            <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" />
            <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="WhatsApp" />
            <input name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Ciudad" />
          </div>

          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
          />

          <h3>Cambiar contraseña</h3>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Nueva contraseña"
          />

          <button disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>

        {/* 🔥 ACTIONS */}
        <div className="profile-actions">
          <button onClick={handleLogout}>Cerrar sesión</button>
          <button onClick={handleDelete} className="danger">
            Eliminar cuenta
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserProfileModal;