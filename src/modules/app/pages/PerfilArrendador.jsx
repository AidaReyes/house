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
import DeleteRoomModal from "../../rooms/components/DeleteRoomModal";
import RoomDetailModal from "../../rooms/components/RoomDetailModal";
import RoomFormModal from "../../rooms/components/RoomFormModal";
import { roomsService } from "../../rooms/service/room.service";

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
      setLoading(true);

      const propietarioId = user?._id || user?.id;

      if (!propietarioId) {
        setRooms([]);
        return;
      }

      const data = await roomsService.getByOwner(propietarioId);
      setRooms(data || []);
    } catch (error) {
      console.error("Error cargando cuartos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (user?._id || user?.id) {
      loadRooms();
    }
  }, [user]);

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

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando cuartos...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 rooms-page">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-lg-3">
              <label className="form-label fw-semibold">Colonia</label>
              <select
                className="form-select"
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
            </div>

            <div className="col-12 col-md-6 col-lg-2">
              <label className="form-label fw-semibold">Precio máximo</label>
              <input
                type="number"
                placeholder="Ej. 3000"
                className="form-control"
                value={filterPrecio}
                onChange={(e) => setFilterPrecio(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label fw-semibold">Buscar cuarto</label>
              <input
                type="text"
                placeholder="Buscar cuarto..."
                className="form-control"
                value={query}
                onChange={onSearchChange}
              />
            </div>

            <div className="col-12 col-lg-4">
              <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setFilterColonia("");
                    setFilterPrecio("");
                  }}
                >
                  Limpiar filtros
                </button>

                <button
                  className={`btn ${
                    applyFilter ? "btn-success" : "btn-primary"
                  }`}
                  onClick={() => setApplyFilter(!applyFilter)}
                >
                  {applyFilter ? "Filtros activos" : "Aplicar filtros"}
                </button>

                <button
                  className="btn btn-outline-primary"
                  onClick={clearSearch}
                >
                  Limpiar búsqueda
                </button>

                <button className="btn btn-success" onClick={openCreateModal}>
                  Nuevo cuarto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {roomsFinal.length === 0 ? (
        <div className="alert alert-light border text-center">
          No hay cuartos registrados
        </div>
      ) : (
        <div className="row g-4">
          {roomsFinal.map((room) => {
            const roomId = room._id || room.id;
            const isPublishing = publishingId === roomId;
            const isMenuOpen = openMenuId === roomId;

            return (
              <div key={roomId} className="col-12 col-md-6 col-xl-3">
                <div className="room-card h-100">
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
                      type="button"
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
                          type="button"
                          className="edit-btn"
                          onClick={() => openEditModal(room)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
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
                  </div>

                  <div className="room-card-body d-flex flex-column">
                    <h3 className="room-title">{room.titulo}</h3>

                    <p className="room-location">
                      <MdLocationOn className="text-icon" />
                      {room.colonia || "Ubicación no especificada"}
                    </p>

                    <p className="room-location">
                      <MdLocationOn className="text-icon" />
                      {room.direccion || "Dirección no especificada"}
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

                    <div className="room-price-section mt-auto">
                      <span className="price-val">${room.precio}</span>
                      <span className="price-type">
                        / {room.tipoRenta || "mes"}
                      </span>
                    </div>

                    <div className="room-buttons d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenDetail(room)}
                      >
                        Detalles
                      </button>

                      <button className="btn btn-outline-primary btn-sm">
                        Información
                      </button>

                      <button
                        className={`btn btn-sm ${
                          room.publicado ? "btn-warning" : "btn-success"
                        }`}
                        onClick={() => handleTogglePublicado(room)}
                        disabled={isPublishing}
                      >
                        {isPublishing
                          ? "Procesando..."
                          : room.publicado
                          ? "Ocultar"
                          : "Publicar"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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