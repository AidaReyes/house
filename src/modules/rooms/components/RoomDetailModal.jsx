import { useEffect, useState } from "react";
import {
  MdAttachMoney,
  MdChair,
  MdCheckCircle,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdFlashOn,
  MdLocalFireDepartment,
  MdLocationOn,
  MdPeople,
  MdWaterDrop,
  MdWifi,
} from "react-icons/md";
import "./RoomDetailModal.css";

const RoomDetailModal = ({ isOpen, onClose, room }) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    setActiveImgIndex(0);
  }, [room, isOpen]);

  if (!isOpen || !room) return null;

  const imagenes = room.imagen || [];
  const hasMultipleImages = imagenes.length > 1;

  const nextImage = () => {
    setActiveImgIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveImgIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const renderServiceIcon = (service) => {
    switch (service?.toLowerCase()) {
      case "agua": return <MdWaterDrop />;
      case "luz": return <MdFlashOn />;
      case "internet": return <MdWifi />;
      case "gas": return <MdLocalFireDepartment />;
      case "amueblado": return <MdChair />;
      default: return <MdCheckCircle />;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content detail-modal">
        <button className="close-button" onClick={onClose}>
          <MdClose size={28} />
        </button>

        <div className="detail-grid">
          <div className="detail-image-section">
            <div className="main-image-wrapper">
              <img
                src={imagenes[activeImgIndex] || "https://via.placeholder.com/500x400?text=Sin+Imagen"}
                alt={`Imagen ${activeImgIndex + 1}`}
                className="detail-main-img"
              />
              
              {hasMultipleImages && (
                <>
                  <button className="nav-arrow left" onClick={prevImage}>
                    <MdChevronLeft />
                  </button>
                  <button className="nav-arrow right" onClick={nextImage}>
                    <MdChevronRight />
                  </button>
                  <div className="img-counter">
                    {activeImgIndex + 1} / {imagenes.length}
                  </div>
                </>
              )}
            </div>
                        {hasMultipleImages && (
              <div className="thumbnails-list">
                {imagenes.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`thumb-wrapper ${idx === activeImgIndex ? "active" : ""}`}
                    onClick={() => setActiveImgIndex(idx)}
                  >
                    <img src={img} alt={`Miniatura ${idx}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="detail-info-section">

            <div className="detail-header">
              <span className={`status-pill ${room.status}`}>
                {room.status}
              </span>
              <h2 className="detail-title">{room.titulo}</h2>
            </div>
            
            <p className="detail-location">
              <MdLocationOn /> {room.direccion}, {room.colonia}
            </p>

            <div className="detail-price-box">
              <MdAttachMoney />
              <span className="amount">{room.precio}</span>
              <span className="period">/ {room.tipoRenta || "mes"}</span>
            </div>

            <div className="detail-divider"></div>

            <section className="detail-block">
              
              <h3>Descripción</h3>

              <p className="description-text">{room.descripcion}</p>
            </section>

            <section className="detail-block">
              <div className="specs-container">
                <div className="spec-tile">
                  <MdPeople />
                  <div>
                    <small>Capacidad</small>
                    <p>{room.capacidad || 1} Personas</p>
                  </div>
                </div>
                <div className="spec-tile">
                  <MdChair />
                  <div>
                    <small>Amueblado</small>
                    <p>{room.amueblado ? "Sí" : "No"}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="detail-block">
              <h3>Servicios Incluidos</h3>
              <div className="services-flex">
                {room.servicios?.map((s, i) => (
                  <div key={i} className="service-tag">
                    {renderServiceIcon(s)}
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </section>
            
            
          </div>
<div className="comments-section">
  <h3>Comentarios</h3>
  <div className="comments-list">
    <div className="comment-item">
      <div className="comment-user-row">
        <div className="user-info-meta">
          <img src="https://i.pravatar.cc/150?u=1" alt="User" className="comment-avatar" />
          <div className="user-details">
            <strong>Emma Davis</strong>
            <div className="stars">★★★★★</div>
          </div>
        </div>
        <div className="comment-actions">
          <button className="btn-publish">Publicar</button>
          <button className="btn-delete">Eliminar</button>
        </div>
      </div>
      <p className="comment-text">
Muy buena relación calidad-precio. Es difícil encontrar lugares amueblados así de cuidados por este precio en la zona.      </p>
    </div>
     <div className="comment-item">
      <div className="comment-user-row">
        <div className="user-info-meta">
          <img src="https://i.pravatar.cc/150?u=1" alt="User" className="comment-avatar" />
          <div className="user-details">
            <strong>Fernanda Flores</strong>
            <div className="stars">★★★★★</div>
          </div>
        </div>
        <div className="comment-actions">
          <button className="btn-publish">Publicar</button>
          <button className="btn-delete">Eliminar</button>
        </div>
      </div>
      <p className="comment-text">
Muy buena relación calidad-precio. Es difícil encontrar lugares amueblados así de cuidados por este precio en la zona.      </p>
    </div>
     <div className="comment-item">
      <div className="comment-user-row">
        <div className="user-info-meta">
          <img src="https://i.pravatar.cc/150?u=1" alt="User" className="comment-avatar" />
          <div className="user-details">
            <strong>David Rivera</strong>
            <div className="stars">★★★★★</div>
          </div>
        </div>
        <div className="comment-actions">
          <button className="btn-publish">Publicar</button>
          <button className="btn-delete">Eliminar</button>
        </div>
      </div>
      <p className="comment-text">
      Muy buena relación calidad-precio. Es difícil encontrar lugares amueblados así de cuidados por este precio en la zona.      </p>
    </div>
    
  </div>
  
</div>

        </div>
        
      </div>
    </div>
  );
};

export default RoomDetailModal;