const API_URL = "http://localhost:3000/api/comment";


// 🔹 Crear comentario
// 🔹 Crear comentario
export const createComment = async (comment) => {
  try {
    const token = localStorage.getItem("token"); // 👈 OBTENER TOKEN

    const res = await fetch(API_URL + "/guardarRegistro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 AQUI
      },
      body: JSON.stringify(comment),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error creando comentario:", error);
    return null;
  }
};

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

// 🔹 Editar comentarios
 export const updateComment = async (id, data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/actualizar/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("Error actualizando comentario:", error);
  }
};
// 🔹 Eliminar comentario

export const deleteComment = async (commentId) => {
  try {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/eliminar/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // 🔥 AQUI
      },
    });

    return true;
  } catch (error) {
    console.error("Error eliminando comentario:", error);
    return false;
  }
};