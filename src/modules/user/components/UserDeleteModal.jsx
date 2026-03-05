import React from "react";
import './components.css'

const UserDeleteModal = ({ user, onClose, onConfirm }) => {
  if (!user) return null;

  return (
    <div className="user-modal-overlay">
      <div className="user-modal">
        <h2>Eliminar Usuario</h2>

        <p>
          ¿Seguro que deseas eliminar a <strong>{user.nombre}</strong>?
        </p>

        <div className="user-modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn-danger" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
