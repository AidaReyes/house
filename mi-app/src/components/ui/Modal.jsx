import React, { useEffect } from 'react'
import './modal.css'

const Modal = ({ open, title, children, onClose, onConfirm, confirmText = 'OK', cancelText = 'Cerrar', showCancel = false }) => {
  if (!open) return null
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div className="ui-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose() }}>
      <div className="ui-modal" onMouseDown={(e) => e.stopPropagation()}>
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
