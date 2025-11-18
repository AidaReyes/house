import React, { useState, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import "./Card.css";

const Card = ({ productos = [], onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Cierra menú si haces click FUERA de cualquier menú
      if (!e.target.closest(".menu-dropdown") && !e.target.closest(".btn-icon")) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const safe = (v) => {
    if (v == null) return "";
    if (["string", "number", "boolean"].includes(typeof v)) return v;
    if (typeof v === "object") return v.nombre || v._id || JSON.stringify(v);
    return String(v);
  };

  const confirmDelete = () => {
    onDelete?.(deleteId);
    setShowModal(false);
  };

  if (!Array.isArray(productos) || productos.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>No hay productos disponibles</p>;
  }

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return date;
    return d.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="card--container">
        {productos.map((item) => {
          const id = item.id || item._id;
          const titulo = safe(item.titulo || item.nombre) || "Sin nombre";
          const imagen = item.imagen || item.Imagen;
          const precio = Number(item.precioVenta ?? item.precio ?? 0);
          const descripcion = safe(item.descripcion);
          const stock = item.stock ?? 0;
          const fechaCompra = safe(item.fechaCompra || item.fechadecompra);
          const fechaCaducidad = safe(item.fechaCaducidad || item.fechacaducidad);
          const proveedor = safe(item.proveedor ?? item.provedoor);
          const precioCompra = item.precioDeCompra ?? item.precioCompra ?? null;

          return (
            <div className="card" key={id}>

              {/* IMAGEN */}
              <div className="card--image">
                {imagen && imagen.startsWith("http") ? (
                  <img src={imagen} alt={titulo} />
                ) : (
                  <span className="placeholder-icon">📦</span>
                )}
              </div>

              <div className="card--right">
                <div className="card--header">
                  <h3>{titulo}</h3>
                  <div>${precio.toFixed(2)}</div>
                </div>

                {descripcion && <p>{descripcion}</p>}

                <div className="card--info">
                  <span>{stock} en stock</span>
                  {fechaCompra && (
                    <div>
                      <strong>Compra:</strong> {formatDate(fechaCompra)}
                    </div>
                  )}
                  {fechaCaducidad && (
                    <div>
                      <strong>Caduca:</strong> {formatDate(fechaCaducidad)}
                    </div>
                  )}
                  {precioCompra != null && (
                    <div>
                      <strong>Precio compra:</strong> $
                      {Number(precioCompra).toFixed(2)}
                    </div>
                  )}
                  {proveedor && (
                    <div>
                      <strong>Proveedor:</strong> {proveedor}
                    </div>
                  )}
                </div>

                {/* === ACCIONES === */}
                <div className="card--actions">
                  <button
                    className="btn-icon"
                    onClick={() => setOpenMenu(openMenu === id ? null : id)}
                  >
                    <BiDotsVerticalRounded size={20} />
                  </button>

                  {openMenu === id && (
                    <div className="menu-dropdown">
                      <button
                        className="menu-item"
                        onClick={() => {
                          setOpenMenu(null);
                          onEdit?.(item);
                        }}
                      >
                        ✏️ Editar
                      </button>

                      <button
                        className="menu-item delete"
                        onClick={() => {
                          setDeleteId(id);
                          setShowModal(true);
                          setOpenMenu(null);
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* === MODAL === */}
      {showModal && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <div className="modal-title">¿Eliminar producto?</div>
            <div className="modal-text">Esta acción no se puede deshacer.</div>

            <div className="modal-buttons">
              <button
                className="btn-modal btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>

              <button className="btn-modal btn-delete" onClick={confirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
