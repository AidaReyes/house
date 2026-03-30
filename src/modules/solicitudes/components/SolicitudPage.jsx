import React, { useEffect, useState } from "react";    
import Modal from "../../product/components/Modal";
import Can from "../../../components/can";
import SolicitudFormModal from "../components/SolicitudFormModal";
import TableWrapper from "../../rents/components/TableWrapper";

const SolicitudPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await solicitudService.getAll();
      setSolicitudes(data || []);
    } catch {
      setError("Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleNuevo = () => { setSelected(null); setShowForm(true); };
  const openEdit = (s) => { setSelected(s); setShowForm(true); };
  const eliminar = async () => {
    try {
      await solicitudService.delete(deleteId);
      setDeleteId(null);
      cargar();
    } catch {
      alert("Error al eliminar solicitud");
    }
  };

  return (
    <div className="rent-page">
      <div className="providers-header">
        <h2>Gestión de Solicitudes</h2>
      </div>

      <div className="crud-actions">
        <div className="providers-header">
          <Can permiso="SOLICITUD_CREATE">
            <button className="btn btn-primary" onClick={handleNuevo}>
              Nueva solicitud
            </button>
          </Can>
        </div>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && (
        <TableWrapper
          data={solicitudes}
          headers={["ID", "Cuarto", "Fecha inicio", "Fecha fin", "Estado", "Mensaje", "Acciones"]}
          renderRow={(s) => (
            <tr key={s._id}>
              <td className="cell-id">{s._id}</td>
              <td>{s.cuarto?.titulo || "—"}</td>
              <td>{new Date(s.fechaInicio).toLocaleDateString()}</td>
              <td>{new Date(s.fechaFin).toLocaleDateString()}</td>
              <td>
                <span className={`role-badge ${s.estado === "aprobada" ? "role-badge-active" : "role-badge-inactive"}`}>
                  {s.estado}
                </span>
              </td>
              <td>{s.mensaje || "—"}</td>
              <td>
                <div className="actions">
                  <Can permiso="SOLICITUD_UPDATE">
                    <button className="btn btn-sm btn-primary" onClick={() => openEdit(s)}>Editar</button>
                  </Can>
                  <Can permiso="SOLICITUD_DELETE">
                    <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(s._id)}>Eliminar</button>
                  </Can>
                </div>
              </td>
            </tr>
          )}
        />
      )}

      {showForm && (
        <SolicitudFormModal
          open={showForm}
          solicitud={selected}
          onClose={() => { setShowForm(false); setSelected(null); }}
          onSaved={cargar}
        />
      )}

      <Modal
        open={!!deleteId}
        title="Eliminar solicitud"
        onClose={() => setDeleteId(null)}
        onConfirm={eliminar}
        confirmText="Eliminar"
        showCancel
      >
        <p>¿Seguro que deseas eliminar esta solicitud?</p>
      </Modal>
    </div>
  );
};

export default SolicitudPage;