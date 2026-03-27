import React, { useEffect } from "react";
import "./modal.css";

const Modal = ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Aceptar",
  cancelText = "Cerrar",
  showCancel = false,
  confirmDisabled = false,
  closeOnOverlay = true,
  closeOnEscape = true,
  loading = false,
}) => {
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && closeOnEscape && !loading) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, closeOnEscape, loading]);

  if (!open) return null;

  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay && !loading) {
      onClose?.();
    }
  };

  const handleConfirm = () => {
    if (loading || confirmDisabled) return;
    if (onConfirm) onConfirm();
    else onClose?.();
  };

  return (
    <div className="ui-modal-overlay" onMouseDown={handleOverlayMouseDown}>
      <div
        className="ui-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ui-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="ui-modal-header">
          <div className="ui-modal-title-wrap">
            <h3 id="ui-modal-title">{title}</h3>
          </div>

          <button
            type="button"
            className="ui-modal-close"
            onClick={() => !loading && onClose?.()}
            aria-label="Cerrar"
            disabled={loading}
          >
            ×
          </button>
        </header>

        <div className="ui-modal-body">{children}</div>

        <footer className="ui-modal-footer">
          {showCancel && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => !loading && onClose?.()}
              disabled={loading}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleConfirm}
            disabled={loading || confirmDisabled}
          >
            {loading ? "Procesando..." : confirmText}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Modal;