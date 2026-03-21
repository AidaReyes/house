import { useEffect, useState } from "react";
import "./RoomFormModal.css";

const RoomFormModal = ({ isOpen, onClose, onSubmit, user, roomData, mode }) => {
  const [form, setForm] = useState({
    titulo: "",
    colonia: "",
    direccion: "",
    descripcion: "",
    precio: 0,
    capacidad: 1,
    servicios: ["agua", "luz", "gas"],
    status: "disponible",
    tipoRenta: "mensual",
    imagen: [],
    referencias: "",
    incluyeServicios: false,
    amueblado: false
  });

  const Icons = {
    Home: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    MapPin: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    Dollar: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    Door: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 3v18H6V3" />
      </svg>
    ),
    Image: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    )
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleServiciosChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      if (checked) {
        return {
          ...prev,
          servicios: [...prev.servicios, value]
        };
      } else {
        return {
          ...prev,
          servicios: prev.servicios.filter((s) => s !== value)
        };
      }
    });
  };

  // 🔹 Convertir archivo a Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // 🔹 Manejar múltiples imágenes
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    const base64Images = await Promise.all(
      files.map(file => convertToBase64(file))
    );

    setForm(prev => ({
      ...prev,
      imagen: base64Images
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userId = user?._id || user?.id;

    if (!userId) {
      console.error("❌ No hay usuario");
      return;
    }

    if (!form.titulo || !form.direccion || !form.colonia) {
      console.error("❌ Faltan campos obligatorios");
      return;
    }

    const dataToSend = {
      titulo: form.titulo || "",
      descripcion: form.descripcion || "",
      precio: Number(form.precio) || 0,
      status: form.status || "disponible",
      propietario: userId,
      direccion: form.direccion || "",
      colonia: form.colonia || "",
      referencias: form.referencias || "",
      capacidad: Number(form.capacidad) || 1,
      servicios: Array.isArray(form.servicios) && form.servicios.length > 0 ? form.servicios : ["agua"],
      incluyeServicios: !!form.incluyeServicios,
      amueblado: !!form.amueblado,
      tipoRenta: form.tipoRenta || "mensual",
      imagen: form.imagen.length > 0
        ? form.imagen
        : ["https://via.placeholder.com/300"],
      publicado: true
    };

    onSubmit(dataToSend);
  };

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && roomData) {
        setForm({
          ...roomData,
          imagen: Array.isArray(roomData.imagen)
            ? roomData.imagen
            : [],
          servicios: roomData.servicios || []
        });
      } else if (mode === "create") {
        setForm({
          titulo: "",
          colonia: "",
          direccion: "",
          descripcion: "",
          precio: 0,
          capacidad: 1,
          servicios: ["agua", "luz", "gas"],
          status: "disponible",
          tipoRenta: "mensual",
          imagen: [],
          referencias: "",
          incluyeServicios: false,
          amueblado: false
        });
      }
    }
  }, [isOpen, roomData, mode]);

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContainer lilaTheme">

        <h2 className="modalTitle">
          {mode === "create" && "Registrar cuarto"}
          {mode === "edit" && "Editar cuarto"}
        </h2>

        <form onSubmit={handleSubmit} className="modalForm">

          <div className="inputField">
            <span className="icon"><Icons.Home /></span>
            <input
              name="titulo"
              placeholder="Nombre del alojamiento"
              value={form.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="inputField">
            <span className="icon"><Icons.Dollar /></span>
            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={form.precio}
              onChange={handleChange}
            />
          </div>

          <div className="inputField">
            <span className="icon"><Icons.MapPin /></span>
            <input
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
            />
          </div>

          <div className="inputField">
            <input
              name="colonia"
              placeholder="Colonia"
              value={form.colonia}
              onChange={handleChange}
            />
          </div>

          <div className="inputField">
            <span className="icon"><Icons.Door /></span>
            <input
              type="number"
              name="capacidad"
              placeholder="Capacidad"
              value={form.capacidad}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="descripcion"
            placeholder="Descripción..."
            value={form.descripcion}
            onChange={handleChange}
          />

          {/* 🔹 INPUT MULTIPLE DE IMÁGENES */}
          <div className="inputField">
            <span className="icon"><Icons.Image /></span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* 🔹 PREVIEW */}
          <div className="previewImages">
            {form.imagen.map((img, index) => (
              <img key={index} src={img} alt="preview" width="80" />
            ))}
          </div>

          <div className="buttonGroup">
            <button type="submit" className="mainBtn">
              {mode === "create" && "Guardar cuarto"}
              {mode === "edit" && "Actualizar cuarto"}
            </button>

            <button type="button" className="secondaryBtn" onClick={onClose}>
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RoomFormModal;