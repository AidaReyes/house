import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import UserFormModal from "../components/UserFormModal.jsx";
import UserDeleteModal from "../components/UserDeleteModal.jsx";
import Can from "../../../components/can"; // para poder ocultar botón de acuerdo al permiso
import { useSearch } from '../../product/hooks/useSearch'

export default function UsersPage() {
  
  const { users, loading, createUser, updateUser, deleteUser } = useUsers();

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Buscador sobre usuarios (id, nombre, usuario)
  const {
    query,
    filteredItems: usersFiltrados,
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

  if (loading) return <p>Cargando usuarios...</p>;

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

  return (
    <div className="users-page">
      <h1>Usuarios</h1>

<div className="crud-actions">

  <div className="providers-header">
    <Can permiso="USER_CREATE">
      <button
        className="btn btn-primary"
        onClick={openCreateModal}
      >
        Nuevo usuario
      </button>
    </Can>
  </div>

  <form className="search" onSubmit={(e) => e.preventDefault()}>
    <input
      type="text"
      placeholder="Buscar permiso..."
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

      <table className="users-table" border="0" cellPadding="8">
        <thead>
          <tr>
            <th>Id usuario</th>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Telefono</th>
            <th>Rol</th>
            <Can permisos={["USER_UPDATE", "USER_DELETE"]}>
              <th>Acciones</th>
            </Can>
          </tr>
        </thead>

        <tbody>
          {(usersFiltrados || []).map((u) => (
            <tr key={u.id ?? u._id}>
              <td>{u.id ?? u._id}</td>
              <td>{u.nombre}</td>
              <td>{u.usuario}</td>
              <td>{u.telefono || "Sin telefono"}</td>
              <td>
                {u.roles?.nombre || "Sin rol"}
              </td>

              <Can permisos={["USER_UPDATE", "USER_DELETE"]}>
                <td>
                  <Can permiso="USER_UPDATE">
                    <button className="btn btn-sm edit" onClick={() => openEditModal(u)}>Editar</button>
                  </Can>
                  <Can permiso="USER_DELETE">
                    <button className="btn btn-sm delete" onClick={() => openDeleteModal(u)}>Eliminar</button>
                  </Can>
                </td>
              </Can>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL CREAR/EDITAR */}
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

      {/* MODAL ELIMINAR */}
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
