import "./DeleteRoomModal.css";
export default function DeleteRoomModal({ isOpen, onClose, onConfirm }) {

  if (!isOpen) return null;

  return (
<div className="delete-overlay">
  <div className="delete-modal">

    <h2 className="delete-title">¿Eliminar cuarto?</h2>
    <p className="delete-text">Esta acción no se puede deshacer</p>

    <div className="delete-actions">
      <button className="cancel-btn" onClick={onClose}>
        Cancelar
      </button>

      <button className="confirm-delete" onClick={onConfirm}>
        Eliminar
      </button>
    </div>

  </div>
</div>
  );
}