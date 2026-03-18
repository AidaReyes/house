import React, { useEffect, useState } from "react";
import { rentService } from "../service/rents.service";
import Modal from "../../product/components/Modal";
import Can from "../../../components/can";
import RentFormModal from "../components/RentFormModal";
import { useSearch } from "../../product/hooks/useSearch";

const RentPage = () => {
  // useEffect(() => {
  //   document.title = "Rents - Cozzy House";
  // }, []);
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
  // Buscador
  // Buscador sobre usuarios (id, nombre, usuario)
  const {
    query,
    filteredItems: rentsFiltrados,
    onChange: onSearchChange,
    clear: clearSearch,
  } = useSearch(rentas || [], (u, q) => {
    const queryLower = q.toLowerCase();
    const id = String(u._id ?? u.id ?? "").toLowerCase();
    const cuarto = String(u.cuarto ?? "").toLowerCase();
    const usuario = String(u.usuario ?? "").toLowerCase();
    const fechainicio = String(u.fechainicio ?? "").toLowerCase();
    const fechafin = String(u.fechafin ?? "").toLowerCase();


    return (
      id.includes(queryLower) ||
      cuarto.includes(queryLower) ||
      usuario.includes(queryLower) ||
      fechainicio.includes(queryLower) ||
      fechafin.includes(queryLower)
    );
  });
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

          <form className="search" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Buscar renta..."
              value={query}
              onChange={onSearchChange}
              className="search-input"
            />

            <button
              type="button"
              className="search-clear"
              onClick={clearSearch}
            >
              Limpiar
            </button>
          </form>

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
                <Can permisos={["RENT_UPDATE", "RENT_DELETE"]}>
                <th>Acciones</th>
                </Can>
              </tr>
            </thead>

            <tbody>

              {rentas.length === 0 && (
                <tr>
                  <td colSpan="7">No hay rentas registradas</td>
                </tr>
              )}

              {rentsFiltrados.map((r) => (

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
                <Can permisos={["RENT_UPDATE", "RENT_DELETE"]}>

                  <td>
                    <div className="table-actions">

                      <Can permiso="RENT_UPDATE">
                        <button
                          className="btn btn-sm edit"
                          onClick={() => openEditModal(r)}
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
                </Can>
                </tr>

              ))}

            </tbody>

          </table>

        </div>

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