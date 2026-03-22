import { useEffect, useState } from "react";
import {
  MdChair,
  MdFavoriteBorder,
  MdFlashOn,
  MdLocalFireDepartment,
  MdLocationOn,
  MdPeople,
  MdWaterDrop,
  MdWifi
} from "react-icons/md";
import { useSearch } from '../../product/hooks/useSearch'; //LIN PARA PODERBUSCAR
import DeleteRoomModal from "../components/DeleteRoomModal";
import RoomDetailModal from "../components/RoomDetailModal";
import RoomFormModal from "../components/RoomFormModal";
import { roomsService } from "../service/room.service";
import "./RoomsPage.css";
export default function RoomsPage() {

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const [mode, setMode] = useState("create"); 
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [filterColonia, setFilterColonia] = useState("");
  const [filterPrecio, setFilterPrecio] = useState("");
  
const loadRooms = async () => {
  try {
    const data = await roomsService.getAll();
    console.log("ROOMS DESDE BACK:", data);

    setRooms(data || []);

  } catch (error) {
    console.error("Error cargando cuartos", error);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    loadRooms();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("USER:", storedUser);
    setUser(storedUser);
  }, []);
  
  const {
   query,
   filteredItems: roomsFiltrados,
   onChange: onSearchChange,
   clear: clearSearch,
}= useSearch(rooms || [], (r, q) => {
  const queryLower = q.toLowerCase();

  const id = String(r._id ?? r.id ?? "").toLowerCase();
  const titulo = String(r.titulo ?? "").toLowerCase();
  const colonia = String(r.colonia ?? "").toLowerCase();
  const direccion = String(r.direccion ?? "").toLowerCase();
  const descripcion = String(r.descripcion ?? "").toLowerCase();

  return (
    id.includes(queryLower) ||
    titulo.includes(queryLower) ||
    colonia.includes(queryLower) ||
    direccion.includes(queryLower) ||
    descripcion.includes(queryLower)
  );
  })

  if (loading) return <p>Cargando cuartos...</p>;

    const handleSave = async (data) => {
    try {
    const userId = user?._id || user?.id;

    const dataFinal = {
      ...data,
      propietario: userId
    };

    if (mode === "create") {
      await roomsService.create(dataFinal);
    }

    if (mode === "edit") {
      await roomsService.update(selectedRoom._id, dataFinal);
    }

 

    await loadRooms();
    setShowForm(false);
    setSelectedRoom(null);

  } catch (error) {
    console.error("ERROR:", error);
  }

};


  const renderServiceIcon = (service) => {
    switch (service) {
      case "agua":
        return <MdWaterDrop className="service-icon" />;
      case "luz":
        return <MdFlashOn className="service-icon" />;
      case "internet":
        return <MdWifi className="service-icon" />;
      case "gas":
        return <MdLocalFireDepartment className="service-icon" />;
      case "amueblado":
        return <MdChair className="service-icon" />;
      default:
        return null;
    }
  };
  const openCreateModal = () => {
  setSelectedRoom(null);
  setMode("create");
  setShowForm(true);
  };

  const openEditModal = (room) => {
  setSelectedRoom(room);
  setMode("edit");
  setShowForm(true);
  };
  const openDeleteModal = (room) => {
  setSelectedRoom(room);
  setShowDelete(true);
  };
  const handleOpenDetail = (room) => {
  setSelectedRoom(room);
  setShowDetail(true);
};
  const handleDelete = async () => {
  try {

    const id = selectedRoom?._id || selectedRoom?.id;

    console.log("🧨 ELIMINANDO:", id);
    console.log("🧨 ROOM COMPLETO:", selectedRoom);

    if (!id) {
      console.error("❌ No hay ID");
      return;
    }

    await roomsService.delete(id);

    await loadRooms();

    setShowDelete(false);
    setSelectedRoom(null);

  } catch (error) {
    console.error("❌ Error eliminando:", error);
  }
};

  return (
<div className="rooms-page">

<div className="rooms-header">

  <div className="rooms-title">
    <h1>Mis cuartos</h1>
  </div>

  <div className="header-right">

    <input
      type="text"
      placeholder="Buscar cuarto..."
      className="search-input"
      value={query}
      onChange={onSearchChange}
    />

    <button
      className="btn btn-sm btn-primary"
      onClick={clearSearch}
    >
      Limpiar
    </button>

    <button
      className="btn btn-sm btn-primary"
      onClick={openCreateModal}
    >
      Nuevo cuarto
    </button>

  </div>

</div>

  <div className="rooms-container">
    {roomsFiltrados.length === 0 ? (
      <p>No hay cuartos registrados</p>
    ) : (
      roomsFiltrados.map((room) => (
        <div className="room-card" key={room._id}>

<div className="room-card-image">
  <img
    src={room.imagen?.[0] || "https://via.placeholder.com/300x200?text=Cozzy+Rental"}
    alt={room.titulo}
  />

  {/* NUEVO: Botón de Favorito */}
  <button className="favorite-btn" title="Guardar en favoritos">
    <MdFavoriteBorder />
  </button>

  <div className={`room-status ${room.status === "disponible" ? "status-online" : "status-offline"}`}>
    {room.status}
  </div>
</div>

          <div className="room-card-body">

            <h3 className="room-title">{room.titulo}</h3>

            <p className="room-location">
              <MdLocationOn className="text-icon" />
              {room.colonia || "Ubicación no especificada"}
            </p>

            <p className="room-location">
              <MdLocationOn className="text-icon" />
              {room.direccion || "Direccion no especificada"}
            </p>

{/* <p className="room-desc">{room.descripcion}</p> */}
            <div className="room-features">
              <span className="feature-badge">
                <MdPeople /> {room.capacidad || 1} pers.
              </span>

              {room.amueblado && (
                <span className="feature-badge">
                  <MdChair /> Amueblado
                </span>
              )}
            </div>

            {room.incluyeServicios && (
              <span className="services-tag">
                Servicios incluidos:
              </span>
            )}

            <div className="room-services-list">
              {room.servicios?.map((serv, index) => (
                <span key={index} className="service-item">
                  {renderServiceIcon(serv)}
                  <small>{serv}</small>
                </span>
              ))}
            </div>

            <div className="room-price-section">
              <span className="price-val">${room.precio}</span>
              <span className="price-type">
                / {room.tipoRenta || "mes"}
              </span>
            </div>
            

            <div className="room-actions">
              <button
                className="edit-btn"
                onClick={() => openEditModal(room)}
              >
                Editar
              </button>

              <button
                className="delete-btn"
                onClick={() => openDeleteModal(room)}
              >
                Eliminar
              </button>
            </div>
             <div className="room-buttons">
<button
  className="btn btn-sm btn-primary"
onClick={() => handleOpenDetail(room)}>
  Detalles
</button>  <button className="btn btn-sm btn-primary">Información</button>
</div>

          </div>
        </div>
      ))
    )}
  </div>

  <RoomFormModal
    isOpen={showForm}
    onClose={() => {
      setShowForm(false);
      setSelectedRoom(null);
    }}
    onSubmit={handleSave}
    roomData={selectedRoom}
    mode={mode}
    user={user}
  />

  <DeleteRoomModal
    isOpen={showDelete}
    onClose={() => {
      setShowDelete(false);
      setSelectedRoom(null);
    }}
    onConfirm={handleDelete}
  />
<RoomDetailModal
  isOpen={showDetail}
  onClose={() => setShowDetail(false)}
  room={selectedRoom}
/>
</div>
);
}