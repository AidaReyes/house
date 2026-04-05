import { useMemo, useState } from "react";
import { useUsers } from "../hooks/useUsers";
import UserFormModal from "../components/UserFormModal.jsx";
import UserDeleteModal from "../components/UserDeleteModal.jsx";
import Can from "../../../components/can";
import { useSearch } from "../../product/hooks/useSearch";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UsersPage() {
  const { users, loading, createUser, updateUser, deleteUser } = useUsers();

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [filterRol, setFilterRol] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const {
    query,
    filteredItems: usersFiltradosBusqueda,
    onChange: onSearchChange,
    clear: clearSearch,
  } = useSearch(users || [], (u, q) => {
    const queryLower = q.toLowerCase();
    const id = String(u._id ?? u.id ?? "").toLowerCase();
    const nombre = String(u.nombre ?? "").toLowerCase();
    const usuario = String(u.usuario ?? "").toLowerCase();
    const telefono = String(u.telefono ?? "").toLowerCase();

    return (
      id.includes(queryLower) ||
      nombre.includes(queryLower) ||
      usuario.includes(queryLower) ||
      telefono.includes(queryLower)
    );
  });

  const rolesDisponibles = useMemo(() => {
    const roles = (users || [])
      .map((u) => u.roles?.nombre)
      .filter(Boolean);

    return [...new Set(roles)];
  }, [users]);

  const usersFiltrados = useMemo(() => {
    return (usersFiltradosBusqueda || []).filter((u) => {
      const rolMatch = filterRol ? u.roles?.nombre === filterRol : true;

      const estadoMatch =
        filterEstado === ""
          ? true
          : filterEstado === "verificado"
          ? !!u.estado
          : !u.estado;

      return rolMatch && estadoMatch;
    });
  }, [usersFiltradosBusqueda, filterRol, filterEstado]);

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando usuarios...</span>
          </div>
        </div>
      </div>
    );
  }

  const openCreateModal = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  const limpiarFiltros = () => {
    setFilterRol("");
    setFilterEstado("");
    clearSearch();
  };

  return (
    <div className="container-fluid py-4 users-page">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
            <div>
              <h1 className="h3 mb-1 fw-bold">Usuarios</h1>
              <p className="text-muted mb-0">
                Gestiona usuarios y filtra la información fácilmente
              </p>
            </div>

            <Can permiso="USER_CREATE">
              <button className="btn btn-primary" onClick={openCreateModal}>
                Nuevo usuario
              </button>
            </Can>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 col-lg-4">
              <label className="form-label fw-semibold">Buscar</label>
              <input
                type="text"
                placeholder="Buscar usuario, nombre, teléfono..."
                value={query}
                onChange={onSearchChange}
                className="form-control"
              />
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label fw-semibold">Rol</label>
              <select
                className="form-select"
                value={filterRol}
                onChange={(e) => setFilterRol(e.target.value)}
              >
                <option value="">Todos los roles</option>
                {rolesDisponibles.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label fw-semibold">Verificación</label>
              <select
                className="form-select"
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="verificado">Verificados</option>
                <option value="no_verificado">No verificados</option>
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-2 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={limpiarFiltros}
              >
                Limpiar
              </button>
            </div>
          </div>

          {usersFiltrados.length === 0 ? (
            <div className="alert alert-light border text-center mb-0">
              No se encontraron usuarios con esos filtros.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Id usuario</th>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Teléfono</th>
                    <th>Verificado</th>
                    <th>Rol</th>
                    <Can permisos={["USER_UPDATE", "USER_DELETE"]}>
                      <th>Acciones</th>
                    </Can>
                  </tr>
                </thead>

                <tbody>
                  {usersFiltrados.map((u) => (
                    <tr key={u.id ?? u._id}>
                      <td className="text-muted small">{u.id ?? u._id}</td>
                      <td>{u.nombre}</td>
                      <td>{u.usuario}</td>
                      <td>{u.telefono || "Sin teléfono"}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.estado ? "text-bg-success" : "text-bg-secondary"
                          }`}
                        >
                          {u.estado ? "Sí" : "No"}
                        </span>
                      </td>
                      <td>{u.roles?.nombre || "Sin rol"}</td>

                      <Can permisos={["USER_UPDATE", "USER_DELETE"]}>
                        <td>
                          <div className="d-flex flex-wrap gap-2">
                            <Can permiso="USER_UPDATE">
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => openEditModal(u)}
                              >
                                Editar
                              </button>
                            </Can>

                            <Can permiso="USER_DELETE">
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => openDeleteModal(u)}
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
        </div>
      </div>

      {showForm && (
        <UserFormModal
          isOpen={showForm}
          user={selectedUser}
          onClose={() => setShowForm(false)}
          onSubmit={(data) => {
            if (selectedUser) {
              updateUser(selectedUser.id ?? selectedUser._id, data);
            } else {
              createUser(data);
            }
            setShowForm(false);
          }}
        />
      )}

      {showDelete && (
        <UserDeleteModal
          user={selectedUser}
          onClose={() => setShowDelete(false)}
          onConfirm={() => {
            deleteUser(selectedUser.id ?? selectedUser._id);
            setShowDelete(false);
          }}
        />
      )}
    </div>
  );
}