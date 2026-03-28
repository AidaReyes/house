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

// ✅ HOOK
import { useSearch } from "../../product/hooks/useSearch";

// ✅ COMPONENTES
import DeleteRoomModal from "../../rooms/components/DeleteRoomModal";
import RoomDetailModal from "../../rooms/components/RoomDetailModal";
import RoomFormModal from "../../rooms/components/RoomFormModal";

// ✅ SERVICE
import { roomsService } from "../../rooms/service/room.service";

// ✅ CSS
import "../../rooms/page/RoomsPage.css";

export default function PerfilArrendador() {

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [filterColonia, setFilterColonia] = useState("");
  const [filterPrecio, setFilterPrecio] = useState("");

  const loadRooms = async () => {
    try {
      const data = await roomsService.getCatalog();
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
    setUser(storedUser);
  }, []);

  const {
    query,
    filteredItems: roomsFiltrados,
    onChange: onSearchChange,
    clear: clearSearch,
  } = useSearch(rooms || [], (r, q) => {
    const queryLower = q.toLowerCase();

    return (
      String(r.titulo ?? "").toLowerCase().includes(queryLower) ||
      String(r.colonia ?? "").toLowerCase().includes(queryLower) ||
      String(r.direccion ?? "").toLowerCase().includes(queryLower) ||
      String(r.descripcion ?? "").toLowerCase().includes(queryLower)
    );
  });

  const roomsFinal = roomsFiltrados.filter((room) => {
    if (!applyFilter) return true;

    const coloniaMatch = filterColonia
      ? room.colonia === filterColonia
      : true;

    const precioMatch = filterPrecio
      ? Number(room.precio) <= Number(filterPrecio)
      : true;

    return coloniaMatch && precioMatch;
  });

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
        return <MdWaterDrop />;
      case "luz":
        return <MdFlashOn />;
      case "internet":
        return <MdWifi />;
      case "gas":
        return <MdLocalFireDepartment />;
      case "amueblado":
        return <MdChair />;
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

      if (!id) return;

      await roomsService.delete(id);
      await loadRooms();

      setShowDelete(false);
      setSelectedRoom(null);

    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  const colonias = [
    "Centro","10 de Mayo","Chililiapa","Cacala","Cosapa","La Victoria",
    "López Mateos","Lindavista","La Otra Banda","Cortadura",
    "Flor del Campo","Garita","Vista Hermosa","Las Cuevas",
    "Tenantipa","Tepeyac","Fraccionamiento Hidalgo",
    "Fraccionamiento San Francisco","El Rastro","Barrio de Jesús"
  ];

  return (
    <div className="rooms-page">

      {/* 🔥 HEADER */}
      <div className="rooms-header">

        <h2>Mis Propiedades</h2>

        <div className="rooms-title">
          <select
            className="search-input"
            value={filterColonia}
            onChange={(e) => setFilterColonia(e.target.value)}
          >
            <option value="">Todas las colonias</option>
            {colonias.map((col, i) => (
              <option key={i} value={col}>{col}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Precio máximo..."
            className="search-input"
            value={filterPrecio}
            onChange={(e) => setFilterPrecio(e.target.value)}
          />
        </div>

        <button onClick={() => { setFilterColonia(""); setFilterPrecio(""); }}>
          Limpiar filtros
        </button>

        <button onClick={() => setApplyFilter(!applyFilter)}>
          Aplicar filtros
        </button>

        <div className="header-right">
          <input
            type="text"
            placeholder="Buscar..."
            value={query}
            onChange={onSearchChange}
          />

          <button onClick={clearSearch}>Limpiar</button>

          <button onClick={openCreateModal}>
            + Nueva Propiedad
          </button>
        </div>
      </div>

      {/* 🔥 CARDS */}
      <div className="rooms-container">
        {roomsFinal.length === 0 ? (
          <p>No hay propiedades</p>
        ) : (
          roomsFinal.map((room) => (
            <div className="room-card" key={room._id}>

              <div className="room-card-image">
                <img
                  src={room.imagen?.[0] || "https://via.placeholder.com/300x200"}
                  alt={room.titulo}
                />

                <button className="favorite-btn">
                  <MdFavoriteBorder />
                </button>

                <div className={`room-status ${room.estado === "disponible" ? "status-online" : "status-offline"}`}>
                  {room.estado}
                </div>
              </div>

              <div className="room-card-body">

                <h3 className="room-title">{room.titulo}</h3>

                <p className="room-location">
                  <MdLocationOn /> {room.colonia}
                </p>

                <p className="room-location">
                  <MdLocationOn /> {room.direccion}
                </p>

                <div className="room-features">
                  <span><MdPeople /> {room.capacidad || 1}</span>
                  {room.amueblado && <span><MdChair /> Amueblado</span>}
                </div>

                <div className="room-services-list">
                  {room.servicios?.map((s, i) => (
                    <span key={i}>
                      {renderServiceIcon(s)} {s}
                    </span>
                  ))}
                </div>

                <div className="room-price-section">
                  <span className="price-val">${room.precio}</span>
                </div>

                <div className="room-buttons">
                  <button onClick={() => openEditModal(room)}>Editar</button>
                  <button onClick={() => openDeleteModal(room)}>Eliminar</button>
                  <button onClick={() => handleOpenDetail(room)}>Detalles</button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔥 MODALES */}
      <RoomFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSave}
        roomData={selectedRoom}
        mode={mode}
        user={user}
      />

      <DeleteRoomModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
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