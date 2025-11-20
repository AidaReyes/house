import api from '../config';

export const providerService = {
  //  Obtener todos los proveedores
  async getAll() {
    const { data } = await api.get('/proveedor/listar');
    return data.data || [];
  },

  //  Crear proveedor
  async create(proveedor) {
    const { data } = await api.post('/proveedor/guardarRegistro', proveedor);
    return data;
  },

  //  Actualizar proveedor
  async update(id, proveedor) {
    const { data } = await api.patch(`/proveedor/actualizar/${id}`, proveedor);
    return data;
  },

  //  Eliminar proveedor
  async delete(id) {
    const { data } = await api.delete(`/proveedor/eliminar/${id}`);
    return data;
  },
};
