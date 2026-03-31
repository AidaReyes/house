import { useEffect, useState } from "react";
import {
  MdChair,
  MdFavoriteBorder,
  MdFlashOn,
  MdLocalFireDepartment,
  MdLocationOn,
  MdPeople,
  MdWaterDrop,
  MdWifi,
  MdMoreVert,
} from "react-icons/md";
import { useSearch } from "../../product/hooks/useSearch";
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
  const [applyFilter, setApplyFilter] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [filterColonia, setFilterColonia] = useState("");
  const [filterPrecio, setFilterPrecio] = useState("");
  const [publishingId, setPublishingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

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
  });

  const roomsFinal = roomsFiltrados.filter((room) => {
    if (!applyFilter) return true;

    const coloniaMatch = filterColonia ? room.colonia === filterColonia : true;
    const precioMatch = filterPrecio
      ? Number(room.precio) <= Number(filterPrecio)
      : true;

    return coloniaMatch && precioMatch;
  });

  const handleSave = async (data) => {
    try {
      const userId = user?._id || user?.id;

      const dataFinal = {
        ...data,
        propietario: userId,
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

  const handleTogglePublicado = async (room) => {
    try {
      const id = room?._id || room?.id;
      if (!id) return;

      setPublishingId(id);

      await roomsService.patch(id, {
        publicado: !room.publicado,
      });

      setRooms((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id
            ? { ...item, publicado: !item.publicado }
            : item
        )
      );
    } catch (error) {
      console.error("Error cambiando publicación:", error);
    } finally {
      setPublishingId(null);
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
    setOpenMenuId(null);
  };

  const openDeleteModal = (room) => {
    setSelectedRoom(room);
    setShowDelete(true);
    setOpenMenuId(null);
  };

  const handleOpenDetail = (room) => {
    setSelectedRoom(room);
    setShowDetail(true);
  };

  const handleDelete = async () => {
    try {
      const id = selectedRoom?._id || selectedRoom?.id;

      if (!id) {
        console.error("No hay ID");
        return;
      }

      await roomsService.delete(id);
      await loadRooms();

      setShowDelete(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  const toggleMenu = (roomId) => {
    setOpenMenuId((prev) => (prev === roomId ? null : roomId));
  };

  const colonias = [
    "Centro",
    "10 de Mayo",
    "Chililiapa",
    "Cacala",
    "Cosapa",
    "La Victoria",
    "López Mateos",
    "Lindavista",
    "La Otra Banda",
    "Cortadura",
    "Flor del Campo",
    "Garita",
    "Vista Hermosa",
    "Las Cuevas",
    "Tenantipa",
    "Tepeyac",
    "Fraccionamiento Hidalgo",
    "Fraccionamiento San Francisco",
    "El Rastro",
    "Barrio de Jesús",
  ];

  if (loading) return <p>Cargando cuartos...</p>;

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
              <option key={index} value={col}>
                {col}
              </option>
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

        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            setFilterColonia("");
            setFilterPrecio("");
          }}
        >
          Limpiar filtros
        </button>

        <button
          className="btn btn-sm btn-primary"
          onClick={() => setApplyFilter(!applyFilter)}
        >
          Aplicar filtros
        </button>

        <div className="header-right">
          <input
            type="text"
            placeholder="Buscar cuarto..."
            className="search-input"
            value={query}
            onChange={onSearchChange}
          />

          <button className="btn btn-sm btn-primary" onClick={clearSearch}>
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
        {roomsFinal.length === 0 ? (
          <p>No hay cuartos registrados</p>
        ) : (
          roomsFinal.map((room) => {
            const roomId = room._id || room.id;
            const isPublishing = publishingId === roomId;
            const isMenuOpen = openMenuId === roomId;

            return (
              <div className="room-card" key={roomId}>
                <div className="room-card-image">
                  <img
                    src={
                      room.imagen?.[0] ||
                      "https://via.placeholder.com/300x200?text=Cozzy+Rental"
                    }
                    alt={room.titulo}
                  />

                  <button
                    className="favorite-btn"
                    title="Guardar en favoritos"
                  >
                    <MdFavoriteBorder />
                  </button>

                  <button
                    type="button"
                    className="room-menu-trigger"
                    onClick={() => toggleMenu(roomId)}
                    title="Más opciones"
                  >
                    <MdMoreVert />
                  </button>

                  {isMenuOpen && (
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
                  )}

                  <div
                    className={`room-status ${
                      room.status === "disponible"
                        ? "status-online"
                        : "status-offline"
                    }`}
                  >
                    {room.status}
                  </div>

                  <label
                    className={`publish-switch ${
                      room.publicado ? "is-on" : "is-off"
                    } ${isPublishing ? "is-loading" : ""}`}
                    title={room.publicado ? "Despublicar" : "Publicar"}
                  >
                    <input
                      type="checkbox"
                      checked={!!room.publicado}
                      onChange={() => handleTogglePublicado(room)}
                      disabled={isPublishing}
                    />
                    <span className="publish-slider"></span>
                    <span className="publish-label">
                      {room.publicado ? "Publicado" : "Oculto"}
                    </span>
                  </label>
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
                    <span className="services-tag">Servicios incluidos:</span>
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

                  <div className="room-buttons">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleOpenDetail(room)}
                    >
                      Detalles
                    </button>

                    <button className="btn btn-sm btn-primary">
                      Información
                    </button>
                  </div>
                </div>
              </div>
            );
          })
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