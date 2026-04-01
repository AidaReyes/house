import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../product/components/Modal";
import { solicitudService } from "../service/Solicitud.Service";
import { roomsService } from "../../rooms/service/room.service";
import "bootstrap/dist/css/bootstrap.min.css";

const initialForm = {
  fechaInicio: "",
  fechaFin: "",
  cuarto: "",
  mensaje: "",
  estado: "pendiente",
};

const SolicitudFormModal = ({ open, onClose, solicitud, onSaved }) => {
  const [cuartos, setCuartos] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!open) return;

    const cargarCuartos = async () => {
      try {
        setLoadingRooms(true);
        setErrorMsg("");

        const rooms = await roomsService.getAll();
        setCuartos(Array.isArray(rooms) ? rooms : []);
      } catch {
        setErrorMsg("No se pudieron cargar los cuartos.");
      } finally {
        setLoadingRooms(false);
      }
    };

    cargarCuartos();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (solicitud) {
      setFormData({
        fechaInicio: solicitud.fechaInicio?.slice(0, 10) || "",
        fechaFin: solicitud.fechaFin?.slice(0, 10) || "",
        cuarto: solicitud.cuarto?._id || "",
        mensaje: solicitud.mensaje || "",
        estado: solicitud.estado || "pendiente",
      });
    } else {
      setFormData(initialForm);
    }

    setErrorMsg("");
  }, [open, solicitud]);

  const cuartosDisponibles = useMemo(() => {
    if (solicitud) return cuartos;
    return cuartos.filter((c) => !c.status || c.status === "disponible");
  }, [cuartos, solicitud]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMsg) setErrorMsg("");
  };

  const validar = () => {
    if (!formData.cuarto) return "Selecciona un cuarto.";
    if (!formData.fechaInicio || !formData.fechaFin) {
      return "Selecciona fechas de inicio y fin.";
    }
    if (formData.fechaFin <= formData.fechaInicio) {
      return "La fecha fin debe ser mayor a la fecha inicio.";
    }
    return "";
  };

  const guardar = async () => {
    const err = validar();

    if (err) {
      setErrorMsg(err);
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const data = {
        cuarto: formData.cuarto,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        mensaje: formData.mensaje,
        estado: formData.estado,
      };

      if (solicitud) {
        await solicitudService.update(solicitud._id, data);
      } else {
        await solicitudService.create(data);
      }

      onSaved?.();
      onClose?.();
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "No se pudo guardar. Intenta de nuevo."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={solicitud ? "Editar solicitud" : "Nueva solicitud"}
      onClose={saving ? undefined : onClose}
      onConfirm={guardar}
      confirmText={saving ? "Guardando..." : "Guardar"}
      showCancel
    >
      <div className="container-fluid">
        {errorMsg && (
          <div className="alert alert-danger text-center mb-3">
            {errorMsg}
          </div>
        )}

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="cuarto" className="form-label">
              Cuarto
            </label>
            <select
              id="cuarto"
              name="cuarto"
              value={formData.cuarto}
              onChange={handleChange}
              disabled={saving || loadingRooms}
              className="form-select"
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
          <div className="col-4 col-md-4">
            <label htmlFor="fechaInicio" className="form-label">
              Fecha inicio
            </label>
            <input
              id="fechaInicio"
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              disabled={saving}
              className="form-control"
            />
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="fechaFin" className="form-label">
              Fecha fin
            </label>
            <input
              id="fechaFin"
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleChange}
              disabled={saving}
              className="form-control"
            />
          </div>



          <div className="col-4 col-md-4">
            <label htmlFor="estado" className="form-label">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              disabled={saving}
              className="form-select"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_revision">En revisión</option>
              <option value="aprobada">Aprobada</option>
              <option value="rechazada">Rechazada</option>
              <option value="cancelada">Cancelada</option>
              <option value="vencida">Vencida</option>
            </select>
          </div>

          <div className="col-12">
            <label htmlFor="mensaje" className="form-label">
              Mensaje (opcional)
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              disabled={saving}
              className="form-control"
              rows="3"
              placeholder="Mensaje al propietario..."
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SolicitudFormModal;