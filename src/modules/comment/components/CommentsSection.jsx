import { useEffect, useState } from "react";
import { MdStar } from "react-icons/md";
import { deleteComment, getCommentsByRoom } from "../service/comment.service";
const CommentsSection = ({ roomId }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5); 
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
const enviarComentario = async () => {
  if (!nuevoComentario.trim()) return;

  const nuevo = {
    texto: nuevoComentario,
    calificacion,
    roomId
  };

  await createComment(nuevo);

  const data = await getCommentsByRoom(roomId);
  setComentarios(data);

  setNuevoComentario("");
  setCalificacion(5);
};
   return (
    <section className="comments-section">
      <h3>Comentarios ({comentarios.length})</h3>

      {/* MENSAJE SI NO HAY */}
      {comentarios.length === 0 && (
        <p className="no-comments">No hay comentarios aún.</p>
      )}

      {/* CAJA DE NUEVO COMENTARIO (SIEMPRE VISIBLE) */}
      <div className="nuevo-comentario-box">
          <div className="input-wrapper">
    <textarea
      placeholder="Nuevo comentario..."
      value={nuevoComentario}
      onChange={(e) => setNuevoComentario(e.target.value)}
      className="input-comentario"
    />

    <button onClick={enviarComentario} className="btn-enviar">
      ➤
    </button>
  </div>
        <div className="stars-input">
          {[...Array(5)].map((_, i) => (
            <MdStar
              key={i}
              onClick={() => setCalificacion(i + 1)}
              color={i < calificacion ? "#ffb400" : "#ccc"}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>


      </div>

      {/* LISTA DE COMENTARIOS */}
      <div className="comments-list">
        {comentarios.map((c) => (
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
        ))}
      </div>
    </section>
  );
};

export default CommentsSection;