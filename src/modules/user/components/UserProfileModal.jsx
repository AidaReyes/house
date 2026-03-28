import React, { useEffect, useState } from 'react';
import './components.css';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // 🔥 ALERTAS BONITAS

const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    usuario: '',
    telefono: '',
    password: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre || '',
        usuario: user.usuario || '',
        telefono: user.telefono || '',
        password: ''
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim() || !form.usuario.trim()) {
      alert('Nombre y correo son obligatorios');
      return;
    }

    setSaving(true);

    const payload = {
      nombre: form.nombre,
      usuario: form.usuario,
      telefono: form.telefono
    };

    if (form.password && form.password.trim() !== '') {
      payload.password = form.password;
    }

    try {
      await updateProfile(payload);

      // 🔥 ALERTA DE ÉXITO
      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        text: 'Tus datos se guardaron correctamente',
        timer: 1500,
        showConfirmButton: false
      });

      onClose();
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el perfil'
      });
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
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAccount();

      Swal.fire({
        icon: 'success',
        title: 'Cuenta eliminada',
        text: 'Tu cuenta fue eliminada correctamente',
        timer: 1500,
        showConfirmButton: false
      });

      onClose();
      navigate('/');
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la cuenta'
      });
    }
  };

  return (
    <div
      className="user-modal-overlay"
      onMouseDown={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div className="user-modal">
        <h2>Mi perfil</h2>

        {/* 🔥 ROL */}
        <p><strong>Rol:</strong> {user?.rol}</p>

        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />

          <label>Correo</label>
          <input
            type="email"
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
          />

          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={form.telefono}
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
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cerrar
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar perfil'}
            </button>
          </div>

          <hr style={{ margin: '1rem 0' }} />

          {/* 🔥 BOTÓN SOLO SI ES ARRENDADOR */}
          {user?.rol === 'ADMIN' && (
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
              onClick={() => {
                onClose();
                navigate('/arrendador');
              }}
            >
              Ir a mi panel de arrendador
            </button>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}
          >
            <button
              type="button"
              className="btn-cancel"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>

            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
            >
              Eliminar cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;