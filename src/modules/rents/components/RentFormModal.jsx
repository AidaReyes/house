import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../product/components/Modal";
import { rentService } from "../service/rents.service";
import { roomsService } from "../../rooms/service/room.service";
import 'bootstrap/dist/css/bootstrap.min.css';

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

  // Cargar cuartos
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

  // Cargar datos edición
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
    if (renta) return cuartos;

    return cuartos.filter((c) => !c.estado || c.estado === "disponible");
  }, [cuartos, renta]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMsg) setErrorMsg("");
  };

  const validarFormulario = () => {
    if (!formData.cuarto) return "Selecciona un cuarto.";

    if (!formData.fechainicio || !formData.fechafin)
      return "Selecciona la fecha de inicio y la fecha de fin.";

    if (formData.fechafin <= formData.fechainicio)
      return "La fecha de fin debe ser mayor a la fecha de inicio.";

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
      <div className="container-fluid">

        {/* Error */}
        {errorMsg && (
          <div className="alert alert-danger text-center">
            {errorMsg}
          </div>
        )}

        <div className="row g-3">
          {/* Cuarto */}
          <div className="col-12">
            <label className="form-label">Cuarto</label>
            <select
              name="cuarto"
              value={formData.cuarto}
              onChange={handleChange}
              className="form-select"
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
          {/* Fecha inicio */}
          <div className="col-4">
            <label className="form-label">Fecha inicio</label>
            <input
              type="date"
              name="fechainicio"
              value={formData.fechainicio}
              onChange={handleChange}
              className="form-control"
              disabled={saving}
            />
          </div>

          {/* Fecha fin */}
          <div className="col-4">
            <label className="form-label">Fecha fin</label>
            <input
              type="date"
              name="fechafin"
              value={formData.fechafin}
              onChange={handleChange}
              className="form-control"
              disabled={saving}
            />
          </div>



          {/* Estado */}
          <div className="col-4">
            <label className="form-label">Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="form-select"
              disabled={saving}
            >
              <option value="activa">Activa</option>
              <option value="finalizada">Finalizada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

        </div>
      </div>
    </Modal>
  );
};

export default RentFormModal;