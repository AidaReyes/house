import api from '../../../api/config';

export const rolService = {
  //  Obtener todos los proveedores
  async getAll() {
    const { data } = await api.get('/roles/listar');
    return data.data || [];
  },

  //  Crear proveedor
  async create(roles) {
    const { data } = await api.post('/roles/guardar', roles);
    return data;
  },

  //  Actualizar proveedor
  async update(id, roles) {
    const { data } = await api.patch(`/roles/actualizar/${id}`, roles);
    return data;
  },

  //  Eliminar proveedor
  async delete(id) {
    const { data } = await api.delete(`/roles/eliminar/${id}`);
    return data;
  },
};
