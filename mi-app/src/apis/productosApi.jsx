const BASE_URL = "http://localhost:3000/api/productos";

export const getProductos = async () => {
  const res = await fetch(`${BASE_URL}/listar`);
  if (!res.ok) throw new Error("Error al obtener productos");
  const json = await res.json();
  return json.data || []; 
};

// Crear nuevo producto
export const createProducto = async (producto) => {
  const res = await fetch(`${BASE_URL}/guardar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return await res.json();
};

// Actualizar producto existente
export const updateProducto = async (id, producto) => {
  const res = await fetch(`${BASE_URL}/actualizar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return await res.json();
};

// Eliminar producto por ID
export const deleteProducto = async (id) => {
  const res = await fetch(`${BASE_URL}/eliminar/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
  return await res.json();
};
