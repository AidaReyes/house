//POR SI SE PIERDEN, ESTO ES DE EDITAR Y ELIMINAR 
import React from 'react';
import { BiEdit, BiTrash } from "react-icons/bi";
import "./Card.css"

const Card = ({ productos, onEdit, onDelete }) => {
  return (
    <div className="card--container">
      {productos.map(item => {
        const safe = (v) => {
          if (v === null || v === undefined) return ''
          if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return v
          if (typeof v === 'object') return v.nombre ?? v._id ?? JSON.stringify(v)
          return String(v)
        }
        const id = item.id || item._id;
        const titulo = safe(item.titulo || item.nombre) || "Sin nombre";
        const imagen = item.imagen || item.Imagen;
        const precio = item.precioVenta ?? item.precio ?? 0;
        const descripcion = safe(item.descripcion);
        const stock = item.stock ?? 0;
        const fechaCompra = safe(item.fechaCompra || item.fechadecompra);
        const fechaCaducidad = safe(item.fechaCaducidad || item.fechacaducidad);
        // proveedor puede ser objeto anidado o un id/string
        const proveedor = safe(item.proveedor ?? item.provedoor);
  const precioCompra = item.precioDeCompra ?? item.precioCompra ?? null;

        return (
          <div className="card" key={id}>
            <div className="card--left">
              <div className="card--image">
                {imagen && imagen.startsWith('https') ? (
                  <img
                    src={imagen}
                    alt={titulo}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '12px'
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '28px', color: '#2b6cb0' }}>📘</span>
                )}
              </div>
            </div>

            <div className="card--right">
              <div className="card--header">
                <h3>{titulo}</h3>
                <div>${Number(precio).toFixed(2)}</div>
              </div>

              <p>{descripcion}</p>

              <div className="card--info">
                <span>{stock} en stock</span>
                <div><strong>Compra:</strong> {fechaCompra}</div>
                {fechaCaducidad && <div><strong>Caduca:</strong> {fechaCaducidad}</div>}
                {precioCompra !== null && (
                  <div><strong>Precio compra:</strong> ${Number(precioCompra).toFixed(2)}</div>
                )}
                <div><strong>Proveedor:</strong> {proveedor}</div>
              </div>

              <div className="card--actions">
                <button
                  className="btn-icon edit"
                  onClick={() => onEdit && onEdit(item)}
                >
                  <BiEdit />
                </button>
                <button
                  className="btn-icon del"
                  onClick={() => onDelete && onDelete(id)}
                >
                  <BiTrash />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;
