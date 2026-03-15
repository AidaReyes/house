import React, { useEffect, useState } from 'react';
import './components.css';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', usuario: '', password: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ nombre: user.nombre || '', usuario: user.usuario || '', password: '' });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { nombre: form.nombre, usuario: form.usuario };
    if (form.password && form.password.trim() !== '') payload.password = form.password;
    try {
      await updateProfile(payload);
      onClose();
    } catch (err) {
      console.error(err);
      alert('No se pudo actualizar el perfil');
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
    const ok = window.confirm('¿Confirma eliminar permanentemente su cuenta? Esta acción no se puede deshacer.');
    if (!ok) return;
    try {
      await deleteAccount();
      onClose();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar la cuenta');
    }
  };

  return (
    <div className="user-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="user-modal">
        <h2>Mi perfil</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          {/* 👇 CAMBIO: se agregó type="text" */}
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />

          <label>Usuario</label>
          {/* 👇 CAMBIO: se agregó type="email" (puede ser text si prefieres) */}
          <input
            type="email"
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
          />

          <label>Contraseña (dejar vacío para no cambiar)</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <div className="user-modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cerrar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar perfil'}
            </button>
          </div>

          <hr style={{ margin: '1rem 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
            <button type="button" className="btn-cancel" onClick={handleLogout}>Cerrar sesión</button>
            <button type="button" className="btn-danger" onClick={handleDelete}>Eliminar cuenta</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;
