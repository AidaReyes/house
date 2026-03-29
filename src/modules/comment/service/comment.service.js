const API_URL = "http://localhost:3000/api/comment";

// 🔹 Obtener comentarios por room
export const getCommentsByRoom = async (roomId) => {
  try {
    const res = await fetch(`${API_URL}/room/${roomId}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error obteniendo comentarios:", error);
    return [];
  }
};

// 🔹 Eliminar comentario
export const deleteComment = async (commentId) => {
  try {
    await fetch(`${API_URL}/eliminar/${commentId}`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error eliminando comentario:", error);
    return false;
  }
};