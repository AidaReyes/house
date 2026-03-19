import React, { useEffect, useState } from "react";
import { rentService } from "../service/rents.service";
import Modal from "../../product/components/Modal";
import Can from "../../../components/can";
import RentFormModal from "../components/RentFormModal";
import TableWrapper from "../components/TableWrapper";

const RentPage = () => {

  const [rentas, setRentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedrent, setSelectedrent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

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

  const handleNuevo = () => {
    setSelectedrent(null);
    setShowForm(true);
  };

  const openEditModal = (renta) => {
    setSelectedrent(renta);
    setShowForm(true);
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
      </div>

      <div className="crud-actions">

        <div className="providers-header">
          <Can permiso="RENT_CREATE">
            <button
              className="btn btn-primary"
              onClick={handleNuevo}
            >
              Nueva renta
            </button>
          </Can>
        </div>

      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && (

        <TableWrapper
          data={rentas}
          headers={[
            "ID",
            "Fecha inicio",
            "Fecha fin",
            "Status",
            "Usuario",
            "Cuarto",
            "Acciones"
          ]}
          renderRow={(r) => (
            <tr key={r._id}>

              <td className="cell-id">{r._id}</td>

              <td>{new Date(r.fechainicio).toLocaleDateString()}</td>

              <td>{new Date(r.fechafin).toLocaleDateString()}</td>

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

              <td>{r.usuario?.nombre}</td>

              <td>{r.cuarto?.titulo}</td>

              <td>
                <div className="actions">

                  <Can permiso="RENT_UPDATE">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => openEditModal(r)}
                    >
                      Editar
                    </button>
                  </Can>

                  <Can permiso="RENT_DELETE">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setDeleteId(r._id)}
                    >
                      Eliminar
                    </button>
                  </Can>

                </div>
              </td>

            </tr>
          )}
        />

      )}

      {/* MODAL CREAR / EDITAR */}
      {showForm && (
        <RentFormModal
          open={showForm}
          renta={selectedrent}
          onClose={() => {
            setShowForm(false);
            setSelectedrent(null);
          }}
          onSaved={cargarRentas}
        />
      )}

      {/* MODAL ELIMINAR */}
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