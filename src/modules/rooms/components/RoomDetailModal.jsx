import React, { useEffect, useState } from "react";
import {
  MdClose,
   MdLocationOn,
  MdArrowBackIos,
   MdAttachMoney,
  MdCalendarMonth,
   MdInfo, MdImage,
   MdChat,
   MdNotificationsActive,
  MdStarBorder,
   MdDelete, MdEdit, MdSend,
  MdWifi, MdOpacity, MdLightbulb, MdAcUnit, MdKitchen, MdDesktopWindows
} from "react-icons/md";
import "./RoomDetailModal.css";
import { getCommentsByRoom, createComment, deleteComment, updateComment } from "../../comment/service/comment.service";

const RoomDetailModal = ({ isOpen, onClose, room }) => {
  const [activeTab, setActiveTab] = useState("galeria");
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [editingId, setEditingId] = useState(null);  // Control del scroll del body
  useEffect(() => {
  if (room && activeTab === "comentarios") {
    loadComments();
  }
}, [room, activeTab]);

const loadComments = async () => {
  if (!room?._id) return;

  const data = await getCommentsByRoom(room._id);
  setComments(data);
};
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  if (!isOpen || !room) return null;

  const imagenes = room.imagen || ["https://via.placeholder.com/800x450"];

  const tabs = [
    { key: "galeria", label: "Galería", icon: <MdImage /> },
    { key: "informacion", label: "Información", icon: <MdInfo /> },
    { key: "comentarios", label: "Comentarios", icon: <MdChat /> },
    { key: "pagos", label: "Pagos", icon: <MdAttachMoney /> },
    { key: "calendario", label: "Calendario", icon: <MdCalendarMonth /> }
  ];

 const handleCreate = async () => {
  if (!newComment.trim()) return;

  if (editingId) {
    const res = await updateComment(editingId, {
      texto: newComment,
      calificacion: rating,
    });

    console.log("RESPUESTA UPDATE:", res);

    if (res?.status === "success") {
      setEditingId(null);
      setNewComment("");
      setRating(0);
      loadComments();
    } else {
      // 👉 IMPORTANTE: salir del modo edición si falla
      setEditingId(null);
    }

  } else {
const comment = {
  roomId: room._id,
  texto: newComment,
  calificacion: rating,
};

    const res = await createComment(comment);

    if (res?.status === "success") {
      setNewComment("");
      setRating(0);

      // 👉 asegúrate de resetear también aquí
      setEditingId(null);

      loadComments();
    }
  }
};
//aqui
const handleDelete = async (id) => {
  const ok = await deleteComment(id);
  if (ok) {
    loadComments();
  }
};
const handleEdit = (comment) => {
  setNewComment(comment.texto);
  setRating(comment.calificacion);
  
  // Guardamos el id que se está editando
  setEditingId(comment._id);
};
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <header className="modal-header-main">
          <div className="header-inner">
            <button className="back-link" onClick={onClose}>
              <MdArrowBackIos /> Volver
            </button>
            <div className="header-text-box">
              <h1>Detalles del Cuarto</h1>
              <p>Gestiona la información de la habitación</p>
            </div>
          </div>
          <button className="close-x-btn" onClick={onClose}>
            <MdClose />
          </button>
        </header>

        {/* Tabs */}
        <nav className="tab-navigation-bar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "tab-item active" : "tab-item"}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        {/* Contenido */}
        <div className="modal-scroll-area">

          {/* Galería */}
          {activeTab === "galeria" && (
            <div className="gallery-layout animate-fade">
              <div className="main-display">
                <img src={imagenes[activeImgIndex]} alt="cuarto" />
                <div className="counter-tag">
                  {activeImgIndex + 1} / {imagenes.length}
                </div>
              </div>

              <div className="thumb-row">
                {imagenes.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className={activeImgIndex === i ? "thumb active" : "thumb"}
                    onClick={() => setActiveImgIndex(i)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Información */}
          {activeTab === "informacion" && (
            <div className="info-layout animate-fade">
              <div className="white-card">

                <div className="card-top">
                  <div>
                    <h2 className="room-title">{room.titulo}</h2>
                   <p className="room-loc">
                     <MdLocationOn /> {room.direccion || "Colonia no especificada"}
                    </p>
                     <p className="room-loc">
  <MdLocationOn /> {room.colonia || "Sin colonia"}
</p> 
                  </div>
                  <span className="status-pill">
  {room.status || "No disponible"}
</span>
                </div>

                <div className="grid-details">
                  <div className="detail-box"><span>Precio</span><strong>${room.precio?.toLocaleString() || "Precio no disponible"}</strong></div>
                  <div className="detail-box">
  <span>Capacidad</span>
  <strong>{room.capacidad || 1} personas</strong>
</div>
 {room.amueblado && (
  <div className="detail-box">
    <span>Amueblado</span>
    <strong>Sí</strong>
  </div>
)}
<div className="detail-box">
  <span>Tipo</span>
  <strong>{room.tipoRenta || "mensual"}</strong>
</div>

                </div>

                <div className="content-block">
                  <h3>Descripción</h3>
                   <p>{room.descripcion || "Sin descripción"}</p>
                </div>

 {room.incluyeServicios && (
  <div className="content-block">
    <h3>Servicios:</h3>
    <div className="tag-cloud">
      {room.servicios?.map((serv, i) => (
        <span key={i} className="amenity-tag">
          {serv === "internet" && <MdWifi />}
          {serv === "agua" && <MdOpacity />}
          {serv === "luz" && <MdLightbulb />}
          {serv === "gas" && <MdAcUnit />}
          {serv === "amueblado" && <MdKitchen />}
          {serv}
        </span>
      ))}
    </div>
  </div>
)}
              </div>
            </div>
          )}

          {/* Comentarios */}
          {activeTab === "comentarios" && (
            <div className="comments-layout animate-fade">
              <div className="white-card">

                <div className="card-header-icon">
                  <MdChat /> Comentarios
                </div>

                <div className="comment-box-input">
<textarea
  placeholder="Escribe un comentario..."
  value={newComment}
  onChange={(e) => setNewComment(e.target.value)}
/>                  <div className="input-actions">
                    <div className="stars-row">
<div className="stars-row">
  {[1, 2, 3, 4, 5].map((star) => (
    <MdStarBorder
      key={star}
      onClick={() => setRating(star)}
      style={{
        cursor: "pointer",
        color: star <= rating ? "#ffc107" : "#ccc",
        fontSize: "22px"
      }}
    />
  ))}
</div>
 </div>
<button className="btn-publish-gray" onClick={handleCreate}>
  <MdSend /> {editingId ? "Actualizar" : "Publicar"}
</button>
                  </div>
                </div>

 {comments.map((c) => (
  <div key={c._id} className="comment-card-item">
    <div className="avatar-circle">
      {c.userId?.nombre?.charAt(0) || "U"}
    </div>

    <div className="comment-right">
      <div className="user-info">
        <strong>{c.userId?.nombre}</strong>
        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
      </div>

      <p>{c.texto}</p>
       <div className="stars-row">
  {[1, 2, 3, 4, 5].map((star) => (
    <MdStarBorder
      key={star}
      style={{
        color: star <= c.calificacion ? "#ffc107" : "#ccc",
        fontSize: "18px"
      }}
    />
  ))}
</div>
<div className="action-buttons">
  <button className="del" onClick={() => handleDelete(c._id)}>
    <MdDelete /> Eliminar
  </button>

  <button className="edit" onClick={() => handleEdit(c)}>
    <MdEdit /> Editar
  </button>
</div>

    </div>
  </div>
))}
              </div>
            </div>
          )}

          {/* Pagos */}
          {activeTab === "pagos" && (
            <div className="payments-layout animate-fade">
              <div className="white-card">

                <div className="payments-header">
                  <div className="card-header-icon">
                    <MdAttachMoney /> Historial
                  </div>
                  <div className="total-label">
                    Total <span className="green-text">$42,500</span>
                  </div>
                </div>

                {["Abril", "Marzo", "Febrero"].map((mes, i) => (
                  <div key={i} className="payment-entry">
                    <div>
                      <span className="p-pill">Pagado</span>
                      <span className="p-date">1 {mes} 2026</span>
                    </div>
                    <strong>$8,500</strong>
                  </div>
                ))}

              </div>
            </div>
          )}

          {/* Calendario */}
 {/* Calendario */}
{activeTab === "calendario" && (
  <div className="calendar-layout animate-fade">
    <div className="white-card no-padding">
      <div className="calendar-container">
        
        {/* Header con Icono */}
        <div className="card-header-icon section-title">
          <MdCalendarMonth /> Calendario de pagos
        </div>

        {/* Hero Card Azul */}
        <div className="blue-hero-card">
          <div className="hero-content">
            <div className="hero-icon-wrapper">
              <MdNotificationsActive className="notification-icon" />
            </div>
            <div className="hero-text">
              <span className="hero-label">Próximo pago</span>
              <h2 className="hero-title-main">Renta Mayo 2026</h2>
              <div className="hero-date-row">
                <span className="hero-date">Fecha: 1/05/2026</span>
                <span className="days-badge">En 26 días</span>
              </div>
            </div>
            <div className="hero-price-large">${room.precio?.toLocaleString() || "8,500"}</div>
          </div>
          <button className="black-pay-btn">Pagar ahora</button>
        </div>

        {/* Pagos Programados */}
        <div className="scheduled-section">
          <div className="card-header-icon sub-section">
            <MdInfo /> Pagos programados
          </div>
          
          <div className="scheduled-list">
            {[
              { month: "Mayo 2026", date: "1/05/2026", days: "26 días", current: true },
              { month: "Junio 2026", date: "1/06/2026", days: "57 días" },
              { month: "Julio 2026", date: "1/07/2026", days: "87 días" },
              { month: "Agosto 2026", date: "1/08/2026", days: "118 días" },
            ].map((item, idx) => (
              <div key={idx} className={`scheduled-item ${item.current ? 'active-item' : ''}`}>
                <div className="sched-left">
                  <div className="sched-title-row">
                    <strong>Renta {item.month}</strong>
                    {item.current && <span className="mini-status-pill">Próximo</span>}
                  </div>
                  <span className="sched-date">{item.date}</span>
                </div>
                <div className="sched-right">
                  <span className="sched-price">${room.precio?.toLocaleString() || "8,500"}</span>
                  <span className="sched-days-label">{item.days}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recordatorios Automáticos */}
        <div className="automation-box">
          <h4 className="automation-title">Recordatorios automáticos</h4>
          <p className="automation-text">Recibirás notificaciones 3 días antes de cada fecha de pago</p>
          <div className="next-notif-bar">
            <span>Próxima notificación: <strong>28 abr</strong></span>
          </div>
        </div>

      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailModal;