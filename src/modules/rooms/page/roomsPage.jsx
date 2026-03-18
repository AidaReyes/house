import { useEffect, useState } from "react";
import DeleteRoomModal from "../components/DeleteRoomModal"; // 👈 NUEVO
import EditRoomModal from "../components/EditRoomModal";
import RoomFormModal from "../components/RoomFormModal";
import { roomsService } from "../service/room.service";
import "./RoomsPage.css";

export default function RoomsPage() {

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false); // 👈 NUEVO

  const [selectedRoom, setSelectedRoom] = useState(null);

  // 🔹 Cargar cuartos
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

  // 🔹 Crear
  const openCreateModal = () => {
    setSelectedRoom(null);
    setShowForm(true);
  };

  // 🔹 Editar
  const openEditModal = (room) => {
    setSelectedRoom(room);
    setShowEdit(true);
  };

  // 🔹 Eliminar (abrir modal)
  const openDeleteModal = (room) => {
    setSelectedRoom(room);
    setShowDelete(true);
  };

  // 🔹 Confirmar eliminar
  const confirmDelete = async () => {
    await roomsService.delete(selectedRoom._id);
    loadRooms();
    setShowDelete(false);
  };

  // 🔹 Crear
  const handleCreate = async (data) => {
    await roomsService.create(data);
    loadRooms();
    setShowForm(false);
  };

  // 🔹 Actualizar
  const handleUpdate = async (data) => {
    await roomsService.update(selectedRoom._id, data);
    loadRooms();
    setShowEdit(false);
  };

  return (
    <div className="rooms-page">

      <h1>Mis cuartos</h1>

      <div className="crud-actions">
        <button className="btn btn-primary" onClick={openCreateModal}>
          Nuevo cuarto
        </button>
      </div>

      {/* CARDS */}
      <div className="rooms-container">
        {rooms.map((room) => (
          <div className="room-card" key={room._id}>

            <div className="room-status">{room.status}</div>

            <h3 className="room-title">{room.titulo}</h3>
            <p className="room-desc">{room.descripcion}</p>
            <p className="room-price">${room.precio}</p>

            <div className="actions">
              <button onClick={() => openEditModal(room)}>
                Editar
              </button>

              <button
                className="delete"
                onClick={() => openDeleteModal(room)}
              >
                Eliminar
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* MODALES */}
      <RoomFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
      />

      <EditRoomModal
        room={selectedRoom}
        onClose={() => setShowEdit(false)}
        onSubmit={handleUpdate}
      />

      <DeleteRoomModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />

    </div>
  );
}