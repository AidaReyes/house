import { useEffect, useState } from "react";
import "./RoomFormModal.css";

const RoomFormModal = ({ isOpen, onClose, onSubmit, user, roomData, mode }) => {
  const coloniasZacualtipan = [
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
   "El Rastro", "Barrio de Jesús"
  ].sort();

  const [form, setForm] = useState({
    titulo: "", colonia: "", direccion: "", descripcion: "", precio: 0,
    capacidad: 1, servicios: ["agua", "luz", "gas"], status: "disponible",
    tipoRenta: "mensual", imagen: [], referencias: "", incluyeServicios: false, amueblado: false
  });

  const Icons = {
    Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    MapPin: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
    Dollar: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    Door: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 20H2"/><path d="M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z"/><path d="M11 4H8a2 2 0 0 0-2 2v14"/><path d="M14 12h.01"/><path d="M22 20h-3"/></svg>,
    Image: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleServiciosChange = (e) => {
    const { value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      servicios: checked ? [...prev.servicios, value] : prev.servicios.filter(s => s !== value)
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const base64Images = await Promise.all(files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
      });
    }));
    setForm(prev => ({ ...prev, imagen: [...prev.imagen, ...base64Images] }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setForm(prev => ({ ...prev, imagen: prev.imagen.filter((_, i) => i !== indexToRemove) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = user?._id || user?.id;
    if (!userId) return;
    onSubmit({ ...form, propietario: userId, publicado: true });
  };

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && roomData) {
        setForm({ ...roomData, imagen: Array.isArray(roomData.imagen) ? roomData.imagen : [], servicios: roomData.servicios || [] });
      } else {
        setForm({
          titulo: "", colonia: "", direccion: "", descripcion: "", precio: 0,
          capacidad: 1, servicios: ["agua", "luz", "gas"], status: "disponible",
          tipoRenta: "mensual", imagen: [], referencias: "", incluyeServicios: false, amueblado: false
        });
      }
    }
  }, [isOpen, roomData, mode]);

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContainer lilaTheme">
        <h2 className="modalTitle">{mode === "create" ? "Registrar cuarto" : "Editar cuarto"}</h2>

        <form onSubmit={handleSubmit} className="modalForm">
          <div className="formScrollArea">
            <label className="inputLabel">Nombre del alojamiento</label>
            <div className="inputField">
              <span className="icon"><Icons.Home /></span>
              <input name="titulo" value={form.titulo} onChange={handleChange} required />
            </div>

            <div className="inputRow">
              <div style={{ flex: 1 }}>
                <label className="inputLabel">Precio</label>
                <div className="inputField">
                  <span className="icon"><Icons.Dollar /></span>
                  <input type="number" name="precio" value={form.precio} onChange={handleChange} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label className="inputLabel">Tipo de renta</label>
                <div className="inputField">
                  <select name="tipoRenta" value={form.tipoRenta} onChange={handleChange}>
                    <option value="mensual">Mensual</option>
                    <option value="semanal">Semanal</option>
                  </select>
                </div>
              </div>
            </div>

            <label className="inputLabel">Dirección exacta</label>
            <div className="inputField">
              <span className="icon"><Icons.MapPin /></span>
              <input name="direccion" value={form.direccion} onChange={handleChange} />
            </div>

            <div className="inputRow">
              <div style={{ flex: 1 }}>
                <label className="inputLabel">Colonia (Zacualtipán)</label>
                <div className="inputField">
                  <span className="icon"><Icons.MapPin /></span>
                  <select name="colonia" value={form.colonia} onChange={handleChange} required>
                    <option value="">Selecciona...</option>
                    {coloniasZacualtipan.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label className="inputLabel">Capacidad</label>
                <div className="inputField small">
                  <span className="icon"><Icons.Door /></span>
                  <input type="number" name="capacidad" value={form.capacidad} onChange={handleChange} />
                </div>
              </div>
            </div>

            <label className="inputLabel">Estado de disponibilidad</label>
            <div style={{ padding: "5px 0" }}>
              <label className="checkItem">
                <input type="checkbox" checked={form.status === "disponible"} 
                  onChange={(e) => setForm({...form, status: e.target.checked ? "disponible" : "no disponible"})} />
                <span style={{ marginLeft: "8px", color: "#666" }}>
                  {form.status === "disponible" ? "Disponible ahora" : "No disponible"}
                </span>
              </label>
            </div>

            <label className="inputLabel">Referencias de ubicación</label>
            <div className="inputField">
              <span className="icon"><Icons.MapPin /></span>
              <input name="referencias" value={form.referencias} onChange={handleChange} />
            </div>

            <div className="togglesGroup" style={{ display: "flex", gap: "20px", padding: "10px 0" }}>
              <label className="checkItem">
                <input type="checkbox" name="amueblado" checked={form.amueblado} onChange={handleChange} />
                <span style={{ marginLeft: "8px" }}>¿Amueblado?</span>
              </label>
              <label className="checkItem">
                <input type="checkbox" name="incluyeServicios" checked={form.incluyeServicios} onChange={handleChange} />
                <span style={{ marginLeft: "8px" }}>Incluye servicios</span>
              </label>
            </div>

            {form.incluyeServicios && (
              <div className="servicesSection">
                <div className="servicesGrid">
                  {["agua", "luz", "internet", "gas"].map((serv) => (
                    <label key={serv} className="checkItem">
                      <input type="checkbox" value={serv} checked={form.servicios.includes(serv)} onChange={handleServiciosChange} />
                      <span style={{ marginLeft: "5px" }}>{serv}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <label className="inputLabel">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Cuartos comodos..." />

            <label className="inputLabel">Fotos</label>
            <div className="inputField">
              <span className="icon"><Icons.Image /></span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} />
            </div>

            <div className="previewImagesContainer">
              {form.imagen.map((img, index) => (
                <div key={index} className="previewWrapper">
                  <img src={img} alt="preview" />
                  <button type="button" className="removeImageOverlay" onClick={() => handleRemoveImage(index)}>Eliminar</button>
                </div>
              ))}
            </div>
          </div>

          <div className="buttonGroup">
            <button type="submit" className="mainBtn">Guardar cuarto</button>
            <button type="button" className="secondaryBtn" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomFormModal;