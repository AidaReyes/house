import React from 'react';
import { BiEdit, BiTrash } from "react-icons/bi";

const Card = ({ productos }) => {
  return (
    <div className="card--container">
      {productos.map(item => (
        <div className="card" key={item.id}>
          <div className="card--left">
            <div className="card--image">
              {item.imagen && item.imagen.startsWith('https')? (
                <img
                  src={item.imagen}
                  alt={item.titulo}
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
              <h3>{item.titulo}</h3>
              <div>${item.precioVenta.toFixed(2)}</div>
            </div>

            <p>{item.descripcion}</p>

            <div className="card--info">
              <span>{item.stock} en stock</span>
              <div><strong>Compra:</strong> {item.fechaCompra}</div>
              {item.fechaCaducidad && <div><strong>Caduca:</strong> {item.fechaCaducidad}</div>}
              <div><strong>Proveedor:</strong> {item.proveedor}</div>
            </div>

            <div className="card--actions">
              <button className="btn-icon edit"><BiEdit /></button>
              <button className="btn-icon del"><BiTrash /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
