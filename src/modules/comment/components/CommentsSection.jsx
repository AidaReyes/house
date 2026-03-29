import { useEffect, useState } from "react";
import { MdStar } from "react-icons/md";
import { deleteComment, getCommentsByRoom } from "../service/comment.service";
const CommentsSection = ({ roomId }) => {
  const [comentarios, setComentarios] = useState([]);

useEffect(() => {
  const cargarComentarios = async () => {
    if (roomId) {
      const data = await getCommentsByRoom(roomId);
      setComentarios(data);
    }
  };

  cargarComentarios();
}, [roomId]);

 const eliminarComentario = async (id) => {
  if (!window.confirm("¿Eliminar comentario?")) return;

  const ok = await deleteComment(id);

  if (ok) {
    setComentarios((prev) => prev.filter((c) => c._id !== id));
  }
};

  return (
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
                        <MdStar
                          key={i}
                          color={i < c.calificacion ? "#ffb400" : "#ccc"}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  className="btn-delete"
                  onClick={() => eliminarComentario(c._id)}
                >
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
  );
};

export default CommentsSection;