import React, { useState, useEffect } from "react";
import { useAuth } from '../../../context/AuthContext';
import { BiDotsVerticalRounded } from "react-icons/bi";
import Can from "../../../components/can";//para poder ocultar boton de acuerdo al permiso

const Card = ({ productos = [], onEdit, onDelete }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const { user } = useAuth();
  const role = user?.rol;

  useEffect(() => {
    const handleClickOutside = (e) => {
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

                <div className="card--actions">
                  <Can permisos={["PERMISOS_UPDATE", "PERMISOS_DELETE"]} mode="any">
                    <>
                      <button
                        className="btn-icon"
                        onClick={() => setOpenMenu(openMenu === id ? null : id)}
                      >
                        <BiDotsVerticalRounded size={20} />
                      </button>

                      {openMenu === id && (
                        <div className="menu-dropdown">
                          <Can permiso="PRODUCTO_UPDATE">
                          <button
                            className="menu-item"
                            onClick={() => {
                              setOpenMenu(null);
                              onEdit?.(item);
                            }}
                          >
                            ✏️ Editar
                          </button>
                          </Can>
                          <Can permiso="PRODUCTO_DELETE">
                          <button
                            className="menu-item delete"
                            onClick={() => {
                              setOpenMenu(null);
                              onDelete?.(id);
                            }}
                          >
                            🗑️ Eliminar
                          </button>
                          </Can>
                        </div>
                      )}
                    </>
                  </Can>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Card;
