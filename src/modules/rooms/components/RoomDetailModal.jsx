import { useEffect, useState } from "react";
import {
  MdClose,
  MdLocationOn,
  MdStar
} from "react-icons/md";
import "./RoomDetailModal.css";

const RoomDetailModal = ({ isOpen, onClose, room }) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [comentarios, setComentarios] = useState([]);

  // Resetear índice de imagen al abrir
  useEffect(() => {
    setActiveImgIndex(0);
  }, [room, isOpen]);

  // Cargar comentarios desde el backend

useEffect(() => {
  if (isOpen && room?._id) {

    console.log("ROOM ID FRONT:", room._id); // 👈 AQUÍ

fetch(`http://localhost:3000/api/comment/room/${room._id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA REAL:", data); // 👈 también útil
        setComentarios(data.data || []);
      })
      .catch((err) => {
        console.error("Error al obtener comentarios:", err);
        setComentarios([]);
      });
  }
}, [room, isOpen]);

  if (!isOpen || !room) return null;

  const imagenes = room.imagen || [];

  const eliminarComentario = async (id) => {
    if (!window.confirm("¿Eliminar comentario?")) return;
    try {
await fetch(`http://localhost:3000/api/comment/eliminar/${id}`, {
  method: "DELETE"
});      setComentarios((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
                         <section className="comments-section">
                <h3>Comentarios ({comentarios.length})</h3>
                <div className="comments-list">
                {comentarios.length > 0 ? (
                  comentarios.map((c) => (
                    <div className="comment-item" key={c._id}>
                      <div className="comment-user-row">
                        <div className="user-info-meta">
                          <div className="avatar-circle">
                            {c.userId?.nombre?.charAt(0) || "U"}
                          </div>
                          <div className="user-details">
                            <strong>{c.userId?.nombre}</strong>
                            <div className="stars">
                              {[...Array(5)].map((_, i) => (
                                <MdStar key={i} color={i < c.calificacion ? "#ffb400" : "#ccc"} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <button className="btn-delete" onClick={() => eliminarComentario(c._id)}>
                          Eliminar
                        </button>
                      </div>
                      <p className="comment-text">{c.texto}</p>
                      <small className="comment-date">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  ))
                ) : (
                  <p className="no-comments">No hay comentarios aún.</p>
                )}
               </div>
            </section>
          </div>

          {/* LADO DERECHO: INFO Y COMENTARIOS */}
          <div className="detail-info-section">
            <span className={`status-pill ${room.status === "disponible" ? "disponible" : "no-disponible"}`}>
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