import api from '../../../../api/config';

export const pagoService = {
  async getAll() {
    const { data } = await api.get('/pagos/listar');
    return data.data || [];
  },
  async create(pago) {
    try {
      const { data } = await api.post('/pagos/guardar', pago);
      return data;
    } catch (error) {
      console.error("Error creando pago:", error.response?.data || error.message);
      throw error.response?.data || { message: "Error al crear pago" };
    }
  },
  async update(id, pago) {
    const { data } = await api.patch(`/pagos/actualizar/${id}`, pago);
    return data;
  },
  async delete(id) {
    const { data } = await api.delete(`/pagos/eliminar/${id}`);
    return data;
  },
  async enviarOrden(id) {
    const { data } = await api.post(`/pagos/enviar-orden/${id}`);
    return data;
  },
  
};