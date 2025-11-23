import { useUsers } from "../hooks/useUsers";
import { useState } from "react";
import UserFormModal from "../components/UserFormModal.jsx";
import UserDeleteModal from "../components/UserDeleteModal.jsx";
import "./page.css";

export default function UsersPage() {
    const { users, loading, createUser, updateUser, deleteUser } = useUsers();

    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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

            <button className="btn btn-primary" onClick={openCreateModal}>Nuevo usuario</button>

            <table className="users-table" border="0" cellPadding="8">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {(users || []).map(u => (
                        <tr key={u.id}>
                            <td>{u.nombre}</td>
                            <td>{u.usuario}</td>
                            <td>{u.rol}</td>
                            <td>
                                <button onClick={() => openEditModal(u)}>Editar</button>
                                <button onClick={() => openDeleteModal(u)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* MODAL CREAR/EDITAR */}
            {showForm && (
                <UserFormModal
                    isOpen={showForm}    // ← también aquí
                    user={selectedUser}
                    onClose={() => setShowForm(false)}
                    onSubmit={(data) => {
                        if (selectedUser) {
                            updateUser(selectedUser.id, data);
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
                        deleteUser(selectedUser.id);
                        setShowDelete(false);
                    }}
                />
            )}


        </div>
    );
}
