
export const getProductos = async () => {
  const res = await fetch('http://localhost:3000/api/productos/listar');
  if (!res.ok) throw new Error('Error al obtener productos');
  return await res.json();
};
