import React, { useEffect, useState } from "react";
import { rentService } from "../service/rents.service";
import Modal from "../../product/components/Modal";
import "./rentStyle.css";
import Can from "../../../components/can";

const RentPage = () => {

  const [rentas, setRentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    fechainicio: "",
    fechafin: "",
    usuario: "",
    cuarto: "",
    status: "activa"
  });

  const cargarRentas = async () => {
    try {
      setLoading(true);
      const data = await rentService.getAll();
      setRentas(data || []);
    } catch (err) {
      setError("Error al cargar rentas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRentas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({
      ...s,
      [name]: value
    }));
  };

  const handleNuevo = () => {
    setEditing(null);

    setFormData({
      fechainicio: "",
      fechafin: "",
      usuario: "",
      cuarto: "",
      status: "activa"
    });

    setShowForm(true);
  };

  const handleEditar = (r) => {

    setEditing(r);

    setFormData({
      fechainicio: r.fechainicio?.slice(0, 10),
      fechafin: r.fechafin?.slice(0, 10),
      usuario: r.usuario?._id || r.usuario,
      cuarto: r.cuarto?._id || r.cuarto,
      status: r.status
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {

    if (!formData.fechainicio || !formData.fechafin || !formData.usuario || !formData.cuarto) {
      setFormError("Todos los campos son obligatorios");
      return;
    }

    try {

      if (editing) {
        await rentService.update(editing._id, formData);
      } else {
        await rentService.create(formData);
      }

      setShowForm(false);
      cargarRentas();

    } catch (err) {
      setFormError("Error al guardar renta");
    }

  };

  const eliminar = async () => {

    try {
      await rentService.delete(deleteId);
      setDeleteId(null);
      cargarRentas();
    } catch {
      alert("Error al eliminar renta");
    }

  };

  return (

    <div className="rent-page">

      <div className="providers-header">
        <h2>Gestión de Rentas</h2>

        <Can permiso="RENT_CREATE">
          <button className="btn-primary" onClick={handleNuevo}>
            Nueva renta
          </button>
        </Can>

      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && (

        <div className="table-container">

          <table className="perms-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Status</th>
                <th>Usuario</th>
                <th>Cuarto</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {rentas.length === 0 && (
                <tr>
                  <td colSpan="7">No hay rentas registradas</td>
                </tr>
              )}

              {rentas.map((r) => (

                <tr key={r._id}>

                  <td className="cell-id">
                    {r._id}
                  </td>

                  <td>
                    {new Date(r.fechainicio).toLocaleDateString()}
                  </td>

                  <td>
                    {new Date(r.fechafin).toLocaleDateString()}
                  </td>

                  <td>

                    <span
                      className={`role-badge ${
                        r.status === "activa"
                          ? "role-badge-active"
                          : "role-badge-inactive"
                      }`}
                    >
                      {r.status}
                    </span>

                  </td>

                  <td>
                    {r.usuario?.nombre || r.usuario}
                  </td>

                  <td>
                    {r.cuarto?.nombre || r.cuarto}
                  </td>

                  <td>

                    <div className="table-actions">

                      <Can permiso="RENT_UPDATE">
                        <button
                          className="btn btn-sm edit"
                          onClick={() => handleEditar(r)}
                        >
                          Editar
                        </button>
                      </Can>

                      <Can permiso="RENT_DELETE">
                        <button
                          className="btn btn-sm delete"
                          onClick={() => setDeleteId(r._id)}
                        >
                          Eliminar
                        </button>
                      </Can>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      {/* Modal crear / editar */}

      <Modal
        open={showForm}
        title={editing ? "Editar renta" : "Nueva renta"}
        onClose={() => setShowForm(false)}
        onConfirm={handleSubmit}
        confirmText="Guardar"
        showCancel
      >

        {formError && <p className="error">{formError}</p>}

        <label>Fecha inicio</label>
        <input
          type="date"
          name="fechainicio"
          value={formData.fechainicio}
          onChange={handleChange}
        />

        <label>Fecha fin</label>
        <input
          type="date"
          name="fechafin"
          value={formData.fechafin}
          onChange={handleChange}
        />

        <label>ID Usuario</label>
        <input
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
        />

        <label>ID Cuarto</label>
        <input
          name="cuarto"
          value={formData.cuarto}
          onChange={handleChange}
        />

        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="activa">Activa</option>
          <option value="finalizada">Finalizada</option>
          <option value="cancelada">Cancelada</option>
        </select>

      </Modal>

      {/* Modal eliminar */}

      <Modal
        open={!!deleteId}
        title="Eliminar renta"
        onClose={() => setDeleteId(null)}
        onConfirm={eliminar}
        confirmText="Eliminar"
        showCancel
      >
        <p>¿Seguro que deseas eliminar esta renta?</p>
      </Modal>

    </div>
  );
};

export default RentPage;