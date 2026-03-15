import { useState } from "react";
import { BsEnvelope, BsThreeDotsVertical } from "react-icons/bs";
import { MdLocationOn, MdMeetingRoom, MdOutlineHomeWork, MdOutlineRoomService } from "react-icons/md";
import RoomFormModal from "../components/RoomFormModal";
import { useRooms } from "../hooks/useRooms";
import "./page.css";
const CuartosUser = () => {
  const { rooms, createRoom, deleteRoom } = useRooms();
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);

  const filteredRooms = isSearchActive 
    ? rooms.filter(room =>
        room.alojamiento?.toLowerCase().includes(search.toLowerCase()) ||
        room.ubicacion?.toLowerCase().includes(search.toLowerCase())
      )
    : rooms;

  const handleSearch = () => {
    if (search.trim() !== "") setIsSearchActive(true);
  };

  const handleEdit = (room) => {
    setRoomToEdit(room);
    setIsEditModalOpen(true);
    setMenuOpen(null);
  };

  const displayRooms = search === "" && isSearchActive ? [] : filteredRooms;

  return (
    <div className="cuartos-container">
      <div className="header-flex">
        <h1 className="title-main">
          <MdMeetingRoom size={32} color="#2563eb" />
          Mis cuartos
        </h1>
        <button onClick={() => setOpenModal(true)} className="btn-add">
          Nuevo cuarto
        </button>
      </div>

      <RoomFormModal isOpen={openModal} onClose={() => setOpenModal(false)} onSubmit={createRoom} />

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre o ubicación..."
          value={search}
          className="search-input"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch} className="btn-search">Buscar</button>
        <button onClick={() => {setSearch(""); setIsSearchActive(false);}} className="btn-clear">Limpiar</button>
      </div>

      <div className="rooms-grid">
        {displayRooms.length === 0 && (
          <p style={{ textAlign: "center", gridColumn: "1/-1", color: "#9ca3af", marginTop: "50px" }}>
            No hay cuartos para mostrar.
          </p>
        )}

        {displayRooms.map((room) => (
          <div key={room._id} className="room-card">
            <div className="image-box">
              <img src={room.imagen} alt={room.alojamiento} className="room-img" />
              
              <div className="status-badge" style={{
                backgroundColor: room.disponible ? "#dcfce7" : "#fee2e2",
                color: room.disponible ? "#166534" : "#991b1b"
              }}>
                {room.disponible ? "Disponible" : "No disponible"}
              </div>

              <div className="menu-container">
                <button className="btn-dots" onClick={() => setMenuOpen(menuOpen === room._id ? null : room._id)}>
                  <BsThreeDotsVertical />
                </button>
                {menuOpen === room._id && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleEdit(room)}>Editar</button>
                    <button className="delete-opt" onClick={() => deleteRoom(room._id)}>Eliminar</button>
                  </div>
                )}
              </div>
            </div>

            <div className="room-info-body">
              <h3 className="room-name">{room.alojamiento}</h3>
              
              <div className="details-stack">
                <p className="detail-row"><MdLocationOn className="icon-accent" /> {room.ubicacion}</p>
                <p className="detail-row"><MdOutlineHomeWork className="icon-accent" /> {room.inmuebles}</p>
                <p className="detail-row"><MdOutlineRoomService className="icon-accent" /> {room.servicios}</p>
              </div>

              <div className="card-footer">
                <div className="price-box">
                  <span className="price-val">${room.precio}</span>
                  <span className="price-period">/ mes</span>
                </div>
                
                <div className="actions-group">
                  <button className="btn-detail-view">Detalles</button> 
                  <button className="btn-contact"><BsEnvelope /> Correo</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CuartosUser;
