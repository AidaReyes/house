import { useState } from "react";
import "./RoomFormModal.css";

const RoomFormModal = ({ isOpen, onClose, onSubmit }) => {

  const [form, setForm] = useState({
    alojamiento: "",
    ubicacion: "",
    servicios: "",
    descripcion: "",
    precio: "",
    inmuebles: "",
    Contacto: "",
    imagen: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(form);

    setForm({
      alojamiento: "",
      ubicacion: "",
      servicios: "",
      descripcion: "",
      precio: "",
      inmuebles: "",
      Contacto: "",
      imagen: ""
    });

    onClose();
  };

  return (
    <div className="modalOverlay">
      <div className="modalContainer">

        <h2 className="modalTitle">
          Registrar Nuevo Cuarto
        </h2>

        <form onSubmit={handleSubmit} className="modalForm">

          <input
            name="alojamiento"
            placeholder="Nombre del alojamiento"
            onChange={handleChange}
            className="modalInput"
            required
          />

          <input
            name="ubicacion"
            placeholder="Ubicación"
            onChange={handleChange}
            className="modalInput"
            required
          />

          <input
            name="servicios"
            placeholder="Servicios"
            onChange={handleChange}
            className="modalInput"
            required
          />

          <textarea
            name="descripcion"
            placeholder="Descripción breve"
            onChange={handleChange}
            className="modalTextarea"
          />

          <input
            name="precio"
            type="number"
            placeholder="Cargo mensual"
            onChange={handleChange}
            className="modalInput"
            required
          />

          <input
            name="inmuebles"
            type="text"
            placeholder="Inmuebles"
            onChange={handleChange}
            className="modalInput"
            required
          />

          <input
            name="Contacto"
            type="text"
            placeholder="Correo"
            onChange={handleChange}
            className="modalInput"
            required
          />

          <input
            name="imagen"
            placeholder="URL de la imagen (http://...)"
            onChange={handleChange}
            className="modalInput"
          />

          <div className="modalActions">
            <button type="submit" className="saveBtn">
              Guardar Cuarto
            </button>

            <button
              type="button"
              onClick={onClose}
              className="cancelBtn"
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RoomFormModal;