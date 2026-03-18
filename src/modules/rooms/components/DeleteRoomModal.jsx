import "./RoomFormModal.css";

export default function DeleteRoomModal({ isOpen, onClose, onConfirm }) {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>¿Eliminar cuarto?</h2>
        <p>Esta acción no se puede deshacer</p>

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>

          <button className="delete" onClick={onConfirm}>
            Eliminar
          </button>
        </div>

      </div>
    </div>
  );
}