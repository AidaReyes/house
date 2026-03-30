import React, { useEffect, useState } from "react";
import { pagoService } from "./service/pago.service";
import Modal from "../../product/components/Modal";
import Can from "../../../components/can";
import PagoFormModal from "./PagoFormModal";
import TableWrapper from "../../rents/components/TableWrapper";

const PagoPage = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await pagoService.getAll();
      setPagos(data || []);
    } catch {
      setError("Error al cargar pagos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleNuevo = () => { setSelected(null); setShowForm(true); };
  const openEdit = (p) => { setSelected(p); setShowForm(true); };
  const eliminar = async () => {
    try {
      await pagoService.delete(deleteId);
      setDeleteId(null);
      cargar();
    } catch {
      alert("Error al eliminar pago");
    }
  };

  return (
    <div className="rent-page">
      <div className="providers-header">
        <h2>Gestión de Pagos</h2>
      </div>

      <div className="crud-actions">
        <div className="providers-header">
          <Can permiso="PAGO_CREATE">
            <button className="btn btn-primary" onClick={handleNuevo}>
              Nuevo pago
            </button>
          </Can>
        </div>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && (
        <TableWrapper
          data={pagos}
          headers={["ID", "Renta", "Monto", "Periodo", "Estado", "Notas", "Acciones"]}
          renderRow={(p) => (
            <tr key={p._id}>
              <td className="cell-id">{p._id}</td>
              <td>{p.renta?._id || "—"}</td>
              <td>${p.monto}</td>
              <td>{p.periodoPago}</td>
              <td>
                <span className={`role-badge ${p.estado === "pagado" ? "role-badge-active" : "role-badge-inactive"}`}>
                  {p.estado}
                </span>
              </td>
              <td>{p.notas || "—"}</td>
              <td>
                <div className="actions">
                  <Can permiso="PAGO_UPDATE">
                    <button className="btn btn-sm btn-primary" onClick={() => openEdit(p)}>Editar</button>
                  </Can>
                  <Can permiso="PAGO_DELETE">
                    <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(p._id)}>Eliminar</button>
                  </Can>
                </div>
              </td>
            </tr>
          )}
        />
      )}

      {showForm && (
        <PagoFormModal
          open={showForm}
          pago={selected}
          onClose={() => { setShowForm(false); setSelected(null); }}
          onSaved={cargar}
        />
      )}

      <Modal
        open={!!deleteId}
        title="Eliminar pago"
        onClose={() => setDeleteId(null)}
        onConfirm={eliminar}
        confirmText="Eliminar"
        showCancel
      >
        <p>¿Seguro que deseas eliminar este pago?</p>
      </Modal>
    </div>
  );
};

export default PagoPage;