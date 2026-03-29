import { useEffect, useState } from "react";
import {
  MdClose,
  MdLocationOn
} from "react-icons/md";
import CommentsSection from "../../comment/components/CommentsSection";
import "./RoomDetailModal.css";
const RoomDetailModal = ({ isOpen, onClose, room }) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Resetear índice de imagen al abrir
  useEffect(() => {
    setActiveImgIndex(0);
  }, [room, isOpen]);


  if (!isOpen || !room) return null;

  const imagenes = room.imagen || [];


  return (
    <div className="modal-overlay">
      <div className="modal-content detail-modal">
        <button className="close-button" onClick={onClose}><MdClose size={24} /></button>

        <div className="detail-grid">
          {/* LADO IZQUIERDO: IMAGEN */}
<div className="detail-image-section">
  <div className="main-image-wrapper">
    <img
      src={imagenes[activeImgIndex] || "https://via.placeholder.com/500"} 
      className="detail-main-img"
      alt="Room"
    />
  </div>

  {/* --- NUEVA SECCIÓN DE MINIATURAS --- */}
  {imagenes.length > 1 && (
    <div className="thumbnail-container">
      {imagenes.map((img, index) => (
        <div 
          key={index} 
          className={`thumbnail-item ${activeImgIndex === index ? 'active' : ''}`}
          onClick={() => setActiveImgIndex(index)}
        >
          <img src={img} alt={`Thumbnail ${index}`} />
        </div>
      ))}
    </div>
  )}
  <CommentsSection roomId={room._id} />
  </div>
          {/* LADO DERECHO: INFO Y COMENTARIOS */}
          <div className="detail-info-section">
            <span className={`status-pill ${room.status?.toLowerCase() === "disponible" ? "disponible" : "no-disponible"}`}>
  {room.status}
</span>
            <h2 className="detail-title">{room.titulo}</h2>
            <p className="detail-location"><MdLocationOn /> {room.direccion}, {room.colonia}</p>
            
            <div className="detail-price-box">
              <span className="amount">${room.precio}</span>
              
              <span className="period">/ {room.tipoRenta}</span>
               <h3>Descripción</h3>
              <p className="description-text">{room.descripcion}</p>
                <div className="specs-container">
                <div className="spec-tile">
               <div className="icon-wrapper">👤</div>
                   <div className="spec-info">
                    <span>Capacidad</span>
                    <strong>{room.capacidad} Personas</strong>
                       </div>
               </div>

  <div className="spec-tile">
    <div className="icon-wrapper">🛏️</div>
    <div className="spec-info">
      <span>Amueblado</span>
      <strong>{room.amueblado ? "Sí" : "No"}</strong>
    </div>
  </div>
</div>
{room.incluyeServicios && (
  <div className="detail-block">
    <h3>Servicios incluidos</h3>
    <div className="services-flex">
      {room.servicios.map((s, i) => (
        <span key={i} className="service-tag">{s}</span>
      ))}
    </div>
  </div>
)}
</div>

            <div className="detail-divider"></div>

 
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailModal;