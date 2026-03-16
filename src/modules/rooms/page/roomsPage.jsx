import { useEffect, useState } from "react";
import EditRoomModal from "../components/EditRoomModal";
import RoomFormModal from "../components/RoomFormModal";
import { roomsService } from "../service/room.service";

export default function RoomsPage() {

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // cargar rooms desde el backend
  const loadRooms = async () => {
    try {
      const data = await roomsService.getAll();
      setRooms(data);
    } catch (error) {
      console.error("Error cargando cuartos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  if (loading) return <p>Cargando cuartos...</p>;

  const openCreateModal = () => {
    setSelectedRoom(null);
    setShowForm(true);
  };

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setShowEdit(true);
  };

  const handleCreate = async (data) => {
    await roomsService.create(data);
    loadRooms(); // refrescar tabla
    setShowForm(false);
  };

  const handleUpdate = async (data) => {
    await roomsService.update(selectedRoom._id, data);
    loadRooms();
    setShowEdit(false);
  };

  const handleDelete = async (id) => {
    await roomsService.delete(id);
    loadRooms();
  };

  return (
    <div className="rooms-page">

      <h1>Mis cuartos</h1>

      <div className="crud-actions">
        <button
          className="btn btn-primary"
          onClick={openCreateModal}
        >
          Nuevo cuarto
        </button>
      </div>

      <table className="rooms-table" border="0" cellPadding="8">

        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Status</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {(rooms || []).map((room) => (
            <tr key={room._id}>
              <td>{room._id}</td>
              <td>{room.titulo}</td>
              <td>{room.descripcion}</td>
              <td>${room.precio}</td>
              <td>{room.status}</td>

              <td>
                <button
                  className="btn btn-sm edit"
                  onClick={() => openEditModal(room)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-sm delete"
                  onClick={() => handleDelete(room._id)}
                >
                  Eliminar
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

      {/* MODAL CREAR */}
      {showForm && (
        <RoomFormModal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
        />
      )}

      {/* MODAL EDITAR */}
      {showEdit && (
        <EditRoomModal
          room={selectedRoom}
          onClose={() => setShowEdit(false)}
          onSubmit={handleUpdate}
        />
      )}

    </div>
  );
}