// src/apis/proveedoresApi.js

const BASE_URL = "http://localhost:3000/api/proveedor";

// ✅ Obtener todos los proveedores
export const getProveedores = async () => {
  const res = await fetch(`${BASE_URL}/listar`);
  if (!res.ok) throw new Error("Error al obtener proveedores");
  const json = await res.json();
  return json.data || [];
};

// ✅ Crear proveedor
export const createProveedor = async (proveedor) => {
  const res = await fetch(`${BASE_URL}/guardarRegistro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proveedor),
  });
  if (!res.ok) throw new Error("Error al crear proveedor");
  return await res.json();
};

// ✅ Actualizar proveedor
export const updateProveedor = async (id, proveedor) => {
  const res = await fetch(`${BASE_URL}/actualizar/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proveedor),
  });
  if (!res.ok) throw new Error("Error al actualizar proveedor");
  return await res.json();
};

// ✅ Eliminar proveedor
export const deleteProveedor = async (id) => {
  const res = await fetch(`${BASE_URL}/eliminar/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar proveedor");
  return await res.json();
};
