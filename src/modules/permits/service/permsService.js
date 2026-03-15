import api from '../../../api/config';

export const permisoService = {
  //  Obtener todos los proveedores
  async getAll() {
    const { data } = await api.get('/permiso/listar');
    return data.data || [];
  },

  //  Crear proveedor
  async create(roles) {
    const { data } = await api.post('/permiso/guardar', roles);
    return data;
  },

  //  Actualizar proveedor
  async update(id, roles) {
    const { data } = await api.patch(`/permiso/actualizar/${id}`, roles);
    return data;
  },

  //  Eliminar proveedor
  async delete(id) {
    const { data } = await api.delete(`/permiso/eliminar/${id}`);
    return data;
  },
};
