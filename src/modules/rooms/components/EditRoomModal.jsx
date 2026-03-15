import { useEffect, useState } from "react";
import "./RoomFormMod...css";

const EditRoomModal = ({ isOpen, onClose, onSubmit, roomData }) => {
  const [formData, setFormData] = useState({
    alojamiento: "",
    ubicacion: "",
    precio: "",
    inmuebles: "",
    servicios: "",
    imagen: ""
  });

  useEffect(() => {
    if (roomData && isOpen) {
      setFormData(roomData);
    }
  }, [roomData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <h2 className="modalTitle">Editar Cuarto</h2>
        <form className="modalForm" onSubmit={handleSubmit}>
          <input
            className="modalInput"
            name="alojamiento"
            placeholder="Nombre del alojamiento"
            value={formData.alojamiento}
            onChange={handleChange}
            required
          />
          <input
            className="modalInput"
            name="ubicacion"
            placeholder="Ubicación"
            value={formData.ubicacion}
            onChange={handleChange}
            required
          />
          <input
            className="modalInput"
            name="precio"
            type="number"
            placeholder="Precio por mes"
            value={formData.precio}
            onChange={handleChange}
            required
          />
          <input
            className="modalInput"
            name="inmuebles"
            placeholder="Ej: 1 Cama, 1 Baño"
            value={formData.inmuebles}
            onChange={handleChange}
          />
          <textarea
            className="modalTextarea"
            name="servicios"
            placeholder="Servicios (Wifi, Agua, luz...)"
            value={formData.servicios}
            onChange={handleChange}
          />
          <input
            className="modalInput"
            name="imagen"
            placeholder="URL de la imagen"
            value={formData.imagen}
            onChange={handleChange}
          />

          <div className="modalActions">
            <button type="submit" className="saveBtn">Actualizar</button>
            <button type="button" className="cancelBtn" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomModal;