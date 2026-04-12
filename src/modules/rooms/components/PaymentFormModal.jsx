import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import { pagoService } from "../../pagos/components/service/pago.service";
import "./RoomDetailModal.css";

const PaymentFormModal = ({ isOpen, onClose, room, onSaved }) => {
  const [savingPago, setSavingPago] = useState(false);
  const [previewComprobante, setPreviewComprobante] = useState("");

  const [nuevoPago, setNuevoPago] = useState({
    monto: room?.precio || "",
    periodoPago: "",
    notas: "",
    comprobante: "",
  });

  useEffect(() => {
    if (room && isOpen) {
      setNuevoPago({
        monto: room.precio || "",
        periodoPago: "",
        notas: "",
        comprobante: "",
      });
      setPreviewComprobante("");
    }
  }, [room, isOpen]);

  if (!isOpen) return null;

  const convertirABase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleComprobanteChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "warning",
        title: "Archivo no válido",
        text: "El comprobante debe ser una imagen",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#111827",
      });
      return;
    }

    // límite opcional de 2MB
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Imagen muy pesada",
        text: "La imagen no debe superar los 2 MB",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#111827",
      });
      return;
    }

    try {
      const base64 = await convertirABase64(file);

      setNuevoPago((prev) => ({
        ...prev,
        comprobante: base64,
      }));

      setPreviewComprobante(base64);
    } catch (error) {
      console.error("Error convirtiendo imagen:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo procesar la imagen",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#111827",
      });
    }
  };

  const handleCrearPago = async () => {
    if (!room?._id) return;

    if (!nuevoPago.monto || !nuevoPago.periodoPago) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Debes completar monto y periodo de pago",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#111827",
      });
      return;
    }

    if (!nuevoPago.comprobante) {
      Swal.fire({
        icon: "warning",
        title: "Comprobante requerido",
        text: "Debes seleccionar una imagen como comprobante",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#111827",
      });
      return;
    }

    try {
      setSavingPago(true);

      const payload = {
        renta: room._id,
        monto: Number(nuevoPago.monto),
        periodoPago: nuevoPago.periodoPago,
        notas: nuevoPago.notas,
        comprobante: nuevoPago.comprobante, // base64
      };

      const res = await pagoService.create(payload);

      if (res?.status === "success") {
        setNuevoPago({
          monto: room.precio || "",
          periodoPago: "",
          notas: "",
          comprobante: "",
        });

        setPreviewComprobante("");
        onClose();
        onSaved?.();

        Swal.fire({
          icon: "success",
          title: "Pago registrado",
          text: "El pago se registró correctamente",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#111827",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res?.message || "No se pudo registrar el pago",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#111827",
        });
      }
    } catch (error) {
      console.error("Error creando pago:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Error al registrar pago",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#111827",
      });
    } finally {
      setSavingPago(false);
    }
  };

  return (
    <div className="inner-payment-modal-overlay" onClick={onClose}>
      <div
        className="inner-payment-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inner-payment-header">
          <div>
            <h3>Registrar pago</h3>
            <p>{room?.titulo || "Cuarto seleccionado"}</p>
          </div>

          <button
            className="inner-payment-close"
            onClick={onClose}
            disabled={savingPago}
          >
            <MdClose />
          </button>
        </div>

        <div className="inner-payment-body">
          <div className="payment-fields-grid">
            <div className="payment-field">
              <label>Monto</label>
              <input
                type="number"
                value={nuevoPago.monto}
                onChange={(e) =>
                  setNuevoPago({ ...nuevoPago, monto: e.target.value })
                }
                placeholder="Monto del pago"
              />
            </div>

            <div className="payment-field">
              <label>Periodo de pago</label>
              <input
                type="month"
                value={nuevoPago.periodoPago}
                onChange={(e) =>
                  setNuevoPago({
                    ...nuevoPago,
                    periodoPago: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="payment-field">
            <label>Notas</label>
            <textarea
              value={nuevoPago.notas}
              onChange={(e) =>
                setNuevoPago({ ...nuevoPago, notas: e.target.value })
              }
              placeholder="Notas del pago"
            />
          </div>

          <div className="payment-field">
            <label>Comprobante (imagen)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleComprobanteChange}
            />
          </div>

          {previewComprobante && (
            <div className="payment-preview-box">
              <span className="proof-label">Vista previa</span>
              <img
                src={previewComprobante}
                alt="Vista previa del comprobante"
                className="payment-preview-img"
              />
            </div>
          )}
        </div>

        <div className="inner-payment-footer">
          <button
            className="payment-cancel-btn"
            onClick={onClose}
            disabled={savingPago}
          >
            Cancelar
          </button>

          <button
            className="payment-save-btn"
            onClick={handleCrearPago}
            disabled={savingPago}
          >
            {savingPago ? "Guardando..." : "Guardar pago"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFormModal;