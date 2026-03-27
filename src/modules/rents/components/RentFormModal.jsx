import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../product/components/Modal";
import { rentService } from "../service/rents.service";
import { roomsService } from "../../rooms/service/room.Service";

const initialForm = {
  fechainicio: "",
  fechafin: "",
  cuarto: "",
  estado: "activa",
};

const RentFormModal = ({ open, onClose, renta, onSaved }) => {
  const [cuartos, setCuartos] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState(initialForm);

  // Cargar cuartos solo cuando el modal esté abierto
  useEffect(() => {
    if (!open) return;

    const cargarDatos = async () => {
      try {
        setLoadingRooms(true);
        setErrorMsg("");

        const rooms = await roomsService.getAll();
        setCuartos(Array.isArray(rooms) ? rooms : []);
      } catch (error) {
        console.error("Error cargando cuartos", error);
        setErrorMsg("No se pudieron cargar los cuartos.");
      } finally {
        setLoadingRooms(false);
      }
    };

    cargarDatos();
  }, [open]);

  // Cargar datos cuando se abre en edición
  useEffect(() => {
    if (!open) return;

    if (renta) {
      setFormData({
        fechainicio: renta.fechainicio?.slice(0, 10) || "",
        fechafin: renta.fechafin?.slice(0, 10) || "",
        cuarto: renta.cuarto?._id || "",
        estado: renta.estado || "activa",
      });
    } else {
      setFormData(initialForm);
    }

    setErrorMsg("");
  }, [open, renta]);

  const cuartosDisponibles = useMemo(() => {
    if (renta) {
      return cuartos;
    }

    return cuartos.filter((c) => !c.estado || c.estado === "disponible");
  }, [cuartos, renta]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMsg) {
      setErrorMsg("");
    }
  };

  const validarFormulario = () => {
    if (!formData.cuarto) {
      return "Selecciona un cuarto.";
    }

    if (!formData.fechainicio || !formData.fechafin) {
      return "Selecciona la fecha de inicio y la fecha de fin.";
    }

    if (formData.fechafin <= formData.fechainicio) {
      return "La fecha de fin debe ser mayor a la fecha de inicio.";
    }

    return "";
  };

  const guardar = async () => {
    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setErrorMsg(errorValidacion);
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const data = {
        fechainicio: formData.fechainicio,
        fechafin: formData.fechafin,
        cuarto: formData.cuarto,
        estado: formData.estado,
      };

      console.log("Datos enviados:", data);

      if (renta) {
        await rentService.update(renta._id, data);
      } else {
        await rentService.create(data);
      }

      onSaved?.();
      onClose?.();
    } catch (error) {
      console.error(
        "Error guardando renta:",
        error.response?.data || error.message
      );

      setErrorMsg(
        error.response?.data?.message ||
          "No se pudo guardar la renta. Intenta de nuevo."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={renta ? "Editar renta" : "Nueva renta"}
      onClose={saving ? undefined : onClose}
      onConfirm={guardar}
      confirmText={saving ? "Guardando..." : "Guardar"}
      showCancel
    >
      <div className="rent-form">
        {errorMsg && <div className="form-alert error">{errorMsg}</div>}

        <div className="form-group">
          <label htmlFor="fechainicio">Fecha inicio</label>
          <input
            id="fechainicio"
            type="date"
            name="fechainicio"
            value={formData.fechainicio}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fechafin">Fecha fin</label>
          <input
            id="fechafin"
            type="date"
            name="fechafin"
            value={formData.fechafin}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cuarto">Cuarto</label>
          <select
            id="cuarto"
            name="cuarto"
            value={formData.cuarto}
            onChange={handleChange}
            disabled={saving || loadingRooms}
          >
            <option value="">
              {loadingRooms ? "Cargando cuartos..." : "Seleccionar cuarto"}
            </option>

            {cuartosDisponibles.map((c) => (
              <option key={c._id} value={c._id}>
                {c.titulo || c.numero || "Cuarto sin nombre"}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            disabled={saving}
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