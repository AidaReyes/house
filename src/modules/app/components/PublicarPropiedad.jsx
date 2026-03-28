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

import { useSearch } from "../../product/hooks/useSearch";

import DeleteRoomModal from "../../rooms/components/DeleteRoomModal";
import RoomDetailModal from "../../rooms/components/RoomDetailModal";
import RoomFormModal from "../../rooms/components/RoomFormModal";
import { roomsService } from "../../rooms/service/room.service";

import "../components/PublicarPropiedad.css";

export default function PublicarPropiedad() {

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
      const data = await roomsService.getAll();
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

      <div className="rooms-header">

        <div className="rooms-title">
          <select
            className="search-input"
            value={filterColonia}
            onChange={(e) => setFilterColonia(e.target.value)}
          >
            <option value="">Todas las colonias</option>
            {colonias.map((col, index) => (
              <option key={index} value={col}>{col}</option>
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

        <button onClick={() => {setFilterColonia(""); setFilterPrecio("");}}>
          Limpiar filtros
        </button>

        <button onClick={() => setApplyFilter(!applyFilter)}>
          Aplicar filtros
        </button>

        <div className="header-right">
          <input
            type="text"
            placeholder="Buscar cuarto..."
            value={query}
            onChange={onSearchChange}
          />

          <button onClick={clearSearch}>Limpiar</button>

          <button onClick={openCreateModal}>
            Nuevo cuarto
          </button>
        </div>
      </div>

      {/* 🔥 LISTA */}
      <div className="rooms-container">
        {roomsFinal.map((room) => (
          <div key={room._id}>

            <h3>{room.titulo}</h3>
            <p>{room.colonia}</p>
            <p>${room.precio}</p>

            <button onClick={() => openEditModal(room)}>Editar</button>
            <button onClick={() => openDeleteModal(room)}>Eliminar</button>
            <button onClick={() => handleOpenDetail(room)}>Detalles</button>

          </div>
        ))}
      </div>

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