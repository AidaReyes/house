import React, { useEffect, useState } from "react";
import Modal from "../../product/components/Modal";
import { pagoService } from "./service/pago.service";

const initialForm = {
  renta: "",
  monto: "",
  periodoPago: "",
  comprobante: "",
  notas: "",
  estado: "pendiente",
};

const PagoFormModal = ({ open, onClose, pago, rentaId, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!open) return;
    if (pago) {
      setFormData({
        renta: pago.renta?._id || pago.renta || "",
        monto: pago.monto || "",
        periodoPago: pago.periodoPago || "",
        comprobante: pago.comprobante || "",
        notas: pago.notas || "",
        estado: pago.estado || "pendiente",
      });
    } else {
      setFormData({ ...initialForm, renta: rentaId || "" });
    }
    setErrorMsg("");
  }, [open, pago, rentaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const validar = () => {
    if (!formData.renta) return "Falta el ID de la renta.";
    if (!formData.monto || formData.monto <= 0) return "Ingresa un monto válido.";
    if (!formData.periodoPago) return "Ingresa el periodo de pago (ej: 2025-03).";
    return "";
  };

  const guardar = async () => {
    const err = validar();
    if (err) { setErrorMsg(err); return; }
    try {
      setSaving(true);
      setErrorMsg("");
      const data = {
        renta: formData.renta,
        monto: Number(formData.monto),
        periodoPago: formData.periodoPago,
        comprobante: formData.comprobante,
        notas: formData.notas,
        estado: formData.estado,
      };
      if (pago) {
        await pagoService.update(pago._id, data);
      } else {
        await pagoService.create(data);
      }
      onSaved?.();
      onClose?.();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={pago ? "Editar pago" : "Nuevo pago"}
      onClose={saving ? undefined : onClose}
      onConfirm={guardar}
      confirmText={saving ? "Guardando..." : "Guardar"}
      showCancel
    >
      <div className="rent-form">
        {errorMsg && <div className="form-alert error">{errorMsg}</div>}

        <div className="form-group">
          <label htmlFor="renta">ID de Renta</label>
          <input id="renta" type="text" name="renta"
            value={formData.renta} onChange={handleChange} disabled={saving}
            placeholder="ID de la renta..." />
        </div>

        <div className="form-group">
          <label htmlFor="monto">Monto</label>
          <input id="monto" type="number" name="monto"
            value={formData.monto} onChange={handleChange} disabled={saving}
            placeholder="0.00" min="0" />
        </div>

        <div className="form-group">
          <label htmlFor="periodoPago">Periodo de pago</label>
          <input id="periodoPago" type="month" name="periodoPago"
            value={formData.periodoPago} onChange={handleChange} disabled={saving} />
        </div>

        <div className="form-group">
          <label htmlFor="comprobante">URL comprobante (opcional)</label>
          <input id="comprobante" type="text" name="comprobante"
            value={formData.comprobante} onChange={handleChange} disabled={saving}
            placeholder="https://..." />
        </div>

        <div className="form-group">
          <label htmlFor="notas">Notas (opcional)</label>
          <input id="notas" type="text" name="notas"
            value={formData.notas} onChange={handleChange} disabled={saving} />
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select id="estado" name="estado" value={formData.estado}
            onChange={handleChange} disabled={saving}>
            <option value="pendiente">Pendiente</option>
            <option value="enviado">Enviado</option>
            <option value="validando">Validando</option>
            <option value="pagado">Pagado</option>
            <option value="fallido">Fallido</option>
            <option value="reembolsado">Reembolsado</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default PagoFormModal;