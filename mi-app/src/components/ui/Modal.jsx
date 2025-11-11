import React from 'react'
import './modal.css'

const Modal = ({ open, title, children, onClose, onConfirm, confirmText = 'OK', cancelText = 'Cerrar', showCancel = false }) => {
  if (!open) return null

  return (
    <div className="ui-modal-overlay">
      <div className="ui-modal">
        <header className="ui-modal-header">
          <h3>{title}</h3>
          <button className="ui-modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </header>

        <div className="ui-modal-body">{children}</div>

        <footer className="ui-modal-footer">
          {showCancel && (
            <button className="btn ghost" onClick={onClose}>{cancelText}</button>
          )}
          <button
            className="btn primary"
            onClick={() => {
              if (onConfirm) onConfirm()
              else onClose && onClose()
            }}
          >
            {confirmText}
          </button>
        </footer>
      </div>
    </div>
  )
}

export default Modal
