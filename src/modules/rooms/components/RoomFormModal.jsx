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
    imagen: "",
    disponible: true
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
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
      imagen: "",
      disponible: true
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
            value={form.alojamiento}
            onChange={handleChange}
            className="modalInput"
            required
          />

          <input
            name="ubicacion"
            placeholder="Ubicación"
            value={form.ubicacion}
            onChange={handleChange}
            className="modalInput"
            required
          />

          <input
            name="servicios"
            placeholder="Servicios"
            value={form.servicios}
            onChange={handleChange}
            className="modalInput"
            required
          />

          <textarea
            name="descripcion"
            placeholder="Descripción breve"
            value={form.descripcion}
            onChange={handleChange}
            className="modalTextarea"
          />

          <input
            name="precio"
            type="number"
            placeholder="Cargo mensual"
            value={form.precio}
            onChange={handleChange}
            className="modalInput"
            required
          />

          <input
            name="inmuebles"
            placeholder="Inmuebles"
            value={form.inmuebles}
            onChange={handleChange}
            className="modalInput"
          />

          <input
            name="Contacto"
            placeholder="Correo"
            value={form.Contacto}
            onChange={handleChange}
            className="modalInput"
          />

          <input
            name="imagen"
            placeholder="URL de la imagen"
            value={form.imagen}
            onChange={handleChange}
            className="modalInput"
          />

          {/* DISPONIBLE */}
          <label className="checkboxRow">
            <input
              type="checkbox"
              name="disponible"
              checked={form.disponible}
              onChange={handleChange}
            />
            Disponible
          </label>

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