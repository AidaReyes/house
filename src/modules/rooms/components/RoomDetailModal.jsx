import React, { useEffect, useState } from "react";
import {
  MdClose,
  MdLocationOn,
  MdAttachMoney,
  MdInfo,
  MdImage,
  MdChat,
  MdStarBorder,
  MdDelete,
  MdEdit,
  MdSend,
  MdWifi,
  MdOpacity,
  MdLightbulb,
  MdAcUnit,
  MdKitchen,
  MdAdd,
} from "react-icons/md";
import "./RoomDetailModal.css";
import {
  getCommentsByRoom,
  createComment,
  deleteComment,
  updateComment,
} from "../../comment/service/comment.service";
import { pagoService } from "../../pagos/components/service/pago.service";
import PaymentFormModal from "./PaymentFormModal";
import { rentService } from "../../rents/service/rents.service";
import Swal from "sweetalert2";
import { Filter } from "bad-words"; const filter = new Filter();
// Agregar palabras en español
filter.addWords(
  "pendejo",
  "pendeja",
  "cabron",
  "cabrona",
  "chingar",
  "chingada",
  "chingado",
  "chingas",
  "chingon",
  "chingona",
  "mierda",
  "idiota",
  "estupido",
  "estupida",
  "imbecil",
  "imbécil",
  "tonto",
  "tonta",
  "baboso",
  "babosa",
  "culo",
  "culero",
  "culera",
  "verga",
  "pinche",
  "joder",
  "puta",
  "puto",
  "putazo",
  "zorra",
  "maldito",
  "maldita",
  "perra",
  "perro",
  "no mames",
  "no mms",
  "nmms"
);

const RoomDetailModal = ({ isOpen, onClose, room, user, view }) => {
  const [activeTab, setActiveTab] = useState("galeria");
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [editingId, setEditingId] = useState(null);

  const [pagos, setPagos] = useState([]);
  const [loadingPagos, setLoadingPagos] = useState(false);

  const [showPagoModal, setShowPagoModal] = useState(false);

  const [rentaAprobada, setRentaAprobada] = useState(null);
  const [loadingRenta, setLoadingRenta] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (room?._id) {
      loadMiRentaAprobada();
    } else {
      setRentaAprobada(null);
    }
  }, [room]);

  useEffect(() => {
    if (room && activeTab === "comentarios") {
      loadComments();
    }
  }, [room, activeTab]);

  useEffect(() => {
    if (room && activeTab === "pagos" && rentaAprobada?._id) {
      loadPagos();
    }
  }, [room, activeTab, rentaAprobada]);

  const loadMiRentaAprobada = async () => {
    if (!room?._id) return;

    try {
      setLoadingRenta(true);

      // Debe regresar la renta del usuario logueado para este cuarto
      // con status "aprobada"
      const resp = await rentService.getMiRentaPorCuarto(room._id);

      setRentaAprobada(resp?.data || null);
    } catch (error) {
      console.error("Error cargando renta aprobada:", error);
      setRentaAprobada(null);
    } finally {
      setLoadingRenta(false);
    }
  };

  const loadComments = async () => {
    if (!room?._id) return;

    try {
      const data = await getCommentsByRoom(room._id);
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando comentarios:", error);
      setComments([]);
    }
  };
const loadPagos = async () => {
  try {
    setLoadingPagos(true);
    const resp = await pagoService.getAll();
    const lista = Array.isArray(resp) ? resp : resp?.data || [];

    const pagosFiltrados = lista.filter((p) => {
      if (!p.renta) return false;

      const cuartoId = typeof p.renta === "object" ? p.renta._id : p.renta;

      return String(cuartoId).trim() === String(room._id).trim();
    });

    setPagos(pagosFiltrados);
  } catch (error) {
    console.error("Error cargando pagos:", error);
    setPagos([]);
  } finally {
    setLoadingPagos(false);
  }
};
  const handleDelete = async (id) => {
    try {
      const ok = await deleteComment(id);
      if (ok) {
        loadComments();
      }
    } catch (error) {
      console.error("Error eliminando comentario:", error);
    }
  };

  const handleEdit = (comment) => {
    setNewComment(comment.texto);
    setRating(comment.calificacion);
    setEditingId(comment._id);
  };

  const handleDeletePago = async (id) => {
    try {
      const res = await pagoService.delete(id);
      if (res?.status === "success") {
        loadPagos();
      }
    } catch (error) {
      console.error("Error eliminando pago:", error);
    }
  };

  if (!isOpen || !room) return null;

  const imagenes = room.imagen || ["https://via.placeholder.com/800x450"];

  const tabs = [
    { key: "galeria", label: "Galería", icon: <MdImage /> },
    { key: "informacion", label: "Información", icon: <MdInfo /> },
    { key: "comentarios", label: "Comentarios", icon: <MdChat /> },
    ...(rentaAprobada
      ? [{ key: "pagos", label: "Pagos", icon: <MdAttachMoney /> }]
      : []),
  ];
  const isOwnerComment = (comment) => {
    return (
      comment.userId?._id === user?._id ||
      comment.userId?.id === user?.id
    );
  };

  const isArrendador = user?.rol === "arrendador";
  const canEditComment = (comment) => {
    //  En mis propiedades NADIE edita
    if (view === "mis-propiedades") return false;

    //  En publicados solo el dueño del comentario
    if (view === "publicados") {
      return isOwnerComment(comment) && !isArrendador;
    }

    return false;
  };
  const canDeleteComment = (comment) => {
    // Arrendador puede borrar todo
    if (isArrendador) return true;

    // Usuario normal solo sus comentarios
    return isOwnerComment(comment);
  };
  const handleCreate = async () => {
    if (!newComment.trim()) return;

    // 🔥 VALIDACIÓN CON LIBRERÍA
    if (filter.isProfane(newComment)) {
      Swal.fire({
        icon: "error",
        title: "Comentario no permitido",
        text: "Tu comentario contiene palabras inapropiadas",
        confirmButtonText: "Entendido",
      });
      return;
    }

    try {
      if (editingId) {
        const res = await updateComment(editingId, {
          texto: newComment,
          calificacion: rating,
        });

        if (res?.status === "success") {
          setEditingId(null);
          setNewComment("");
          setRating(0);
          loadComments();
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
          setEditingId(null);
          loadComments();
        }
      }
    } catch (error) {
      console.error("Error guardando comentario:", error);
    }
  };

  return (
    <div className="modal-overlay"
      onClick={onClose}>
      <div
        className="modal-content-container"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header-main">
          <div className="header-inner">
            <div className="header-text-box">
              <h1>Detalles del Cuarto</h1>
              <p>Gestiona la información de la habitación</p>
            </div>
          </div>

          <button className="close-x-btn" onClick={onClose}>
            <MdClose />
          </button>
        </header>

        <nav className="tab-navigation-bar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "tab-item active" : "tab-item"}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <div className="modal-scroll-area">
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
                    alt={`thumb-${i}`}
                    className={activeImgIndex === i ? "thumb active" : "thumb"}
                    onClick={() => setActiveImgIndex(i)}
                  />
                ))}
              </div>
            </div>
          )}

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
                  <div className="detail-box">
                    <span>Precio</span>
                    <strong>
                      ${room.precio?.toLocaleString() || "Precio no disponible"}
                    </strong>
                  </div>

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

                {!loadingRenta && !rentaAprobada && (
                  <div className="content-block">
                    <h3>Pagos</h3>
                    <p>
                      La pestaña de pagos aparecerá cuando tengas una renta
                      aprobada para este cuarto.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

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
                  />

                  <div className="input-actions">
                    <div className="stars-row">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <MdStarBorder
                          key={star}
                          onClick={() => setRating(star)}
                          style={{
                            cursor: "pointer",
                            color: star <= rating ? "#ffc107" : "#ccc",
                            fontSize: "22px",
                          }}
                        />
                      ))}
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
                              fontSize: "18px",
                            }}
                          />
                        ))}
                      </div>

                      <div className="action-buttons">
                        {canDeleteComment(c) && (
                          <button className="del" onClick={() => handleDelete(c._id)}>
                            <MdDelete /> Eliminar
                          </button>
                        )}

                        {canEditComment(c) && (
                          <button className="edit" onClick={() => handleEdit(c)}>
                            <MdEdit /> Editar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "pagos" && rentaAprobada && (
            <div className="payments-layout animate-fade">
              <div className="white-card">
                <div className="payments-header">
                  <div className="card-header-icon">
                    <MdAttachMoney /> Pagos de tu renta
                  </div>
<p>Total registros: {pagos.length}</p>
                  <div className="total-label">
                    Total{" "}
                    <span className="green-text">
                      $
                      {pagos
                        .reduce((acc, item) => acc + Number(item.monto || 0), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="payments-top-actions">
                  <button
                    className="open-payment-modal-btn"
                    onClick={() => setShowPagoModal(true)}
                  >
                    <MdAdd /> Registrar pago
                  </button>
                </div>

                <div className="scheduled-section">
                  <div className="card-header-icon sub-section">
                    <MdInfo /> Historial de pagos
                  </div>

                  {loadingPagos ? (
                    <p>Cargando pagos...</p>
                  ) : pagos.length === 0 ? (
                    <p>No hay pagos registrados para esta renta.</p>
                  ) : (
                  <div className="scheduled-list">
                    {pagos.map((item) => (
                      <div key={item._id} className="scheduled-item active-item">
                        <div className="sched-left">
                          <div className="sched-title-row">
                            <strong>{item.periodoPago}</strong>
                            <span className="mini-status-pill">
                              {item.estado || "pendiente"}
                            </span>
                          </div>

                          <span className="sched-date">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString()
                              : "Sin fecha"}
                          </span>

                          {item.comprobante && (
                            <div className="payment-proof-box">
                              <span className="proof-label">Comprobante</span>
                              <img
                                src={item.comprobante}
                                alt="Comprobante de pago"
                                className="payment-proof-img"
                              />
                            </div>
                          )}
                        </div>

                        <div className="sched-right">
                          <span className="sched-price">
                            ${Number(item.monto || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <PaymentFormModal
          isOpen={showPagoModal}
          onClose={() => setShowPagoModal(false)}
          room={room}
          rentaAprobada={rentaAprobada}
          onSaved={loadPagos}
        />
      </div>
    </div>
  );
};

export default RoomDetailModal;