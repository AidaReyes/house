import React, { useEffect, useState } from "react";
import Modal from "../../product/components/Modal";
import { rentService } from "../service/rents.service";
import { roomsService } from "../../rooms/service/rooms.Service";

import "./rentStyle.css";

const RentFormModal = ({ open, onClose, renta, onSaved }) => {

  const [cuartos, setCuartos] = useState([]);

  const [formData, setFormData] = useState({
    fechainicio: "",
    fechafin: "",
    cuarto: "",
    status: "activa"
  });

  // Cargar cuartos
  useEffect(() => {

    const cargarDatos = async () => {
      try {

        const rooms = await roomsService.getAll();
        setCuartos(rooms || []);

      } catch (error) {
        console.error("Error cargando cuartos", error);
      }
    };

    cargarDatos();

  }, []);

  // Cuando se abre para editar
  useEffect(() => {

    if (renta) {

      setFormData({
        fechainicio: renta.fechainicio?.slice(0,10) || "",
        fechafin: renta.fechafin?.slice(0,10) || "",
        cuarto: renta.cuarto?._id || "",
        status: renta.status || "activa"
      });

    } else {

      setFormData({
        fechainicio: "",
        fechafin: "",
        cuarto: "",
        status: "activa"
      });

    }

  }, [renta]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  const guardar = async () => {

    try {

      if (!formData.cuarto) {
        alert("Selecciona un cuarto");
        return;
      }

      if (!formData.fechainicio || !formData.fechafin) {
        alert("Selecciona las fechas");
        return;
      }

      const data = {
        fechainicio: new Date(formData.fechainicio),
        fechafin: new Date(formData.fechafin),
        cuarto: formData.cuarto,
        status: formData.status
      };

      console.log("Datos enviados:", data);

      if (renta) {
        await rentService.update(renta._id, data);
      } else {
        await rentService.create(data);
      }

      onSaved();
      onClose();

    } catch (error) {

      console.error(
        "Error guardando renta:",
        error.response?.data || error.message
      );

    }

  };

  return (

    <Modal
      open={open}
      title={renta ? "Editar renta" : "Nueva renta"}
      onClose={onClose}
      onConfirm={guardar}
      confirmText="Guardar"
      showCancel
    >

      <div className="rent-form">

        {/* Fecha inicio */}
        <div className="form-group">
          <label>Fecha inicio</label>
          <input
            type="date"
            name="fechainicio"
            value={formData.fechainicio}
            onChange={handleChange}
          />
        </div>

        {/* Fecha fin */}
        <div className="form-group">
          <label>Fecha fin</label>
          <input
            type="date"
            name="fechafin"
            value={formData.fechafin}
            onChange={handleChange}
          />
        </div>

        {/* Cuarto */}
        <div className="form-group">
          <label>Cuarto</label>

          <select
            name="cuarto"
            value={formData.cuarto}
            onChange={handleChange}
          >

            <option value="">Seleccionar cuarto</option>

            {cuartos.map((c) => (
              <option key={c._id} value={c._id}>
                {c.titulo || c.numero}
              </option>
            ))}

          </select>

        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="activa">Activa</option>
            <option value="finalizada">Finalizada</option>
            <option value="cancelada">Cancelada</option>
          </select>

        </div>

      </div>

    </Modal>

  );

};

export default RentFormModal;