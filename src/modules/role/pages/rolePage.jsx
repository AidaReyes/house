// src/modules/role/pages/rolePage.jsx
import React, { useEffect, useState } from "react";
import { rolService } from "../service/rolService"; // Asegúrate que tu servicio exporta esto
import Modal from "../../product/components/Modal";
import "./rolStyle.css";
import Can from "../../../components/can";
import { useSearch } from "../../product/hooks/useSearch";

const RolePage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [editing, setEditing] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    permisos: [],
    activo: true,
  });

  const [deleteId, setDeleteId] = useState(null);

  // Buscador
  const {
    query,
    filteredItems: rolesFiltrados,
    onChange: onSearchChange,
    clear: clearSearch,
  } = useSearch(roles, (r, q) => {
    const queryLower = q.toLowerCase();
    const id = String(r._id ?? r.id ?? "").toLowerCase();
    const nombre = String(r.nombre ?? "").toLowerCase();
    const descripcion = String(r.descripcion ?? "").toLowerCase();
    return (
      id.includes(queryLower) ||
      nombre.includes(queryLower) ||
      descripcion.includes(queryLower)
    );
  });

  // Cargar roles desde API
  const cargarRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rolService.getAll();
      setRoles(data || []);
    } catch (err) {
      setError(err.message || "Error al cargar roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  // Nuevo rol
  const handleNuevo = () => {
    setEditing(null);
    setFormData({
      nombre: "",
      descripcion: "",
      permisos: [],
      activo: true,
    });
    setFormError(null);
    setShowForm(true);
  };

  // Editar rol
  const handleEditar = (rol) => {
    setEditing(rol);
    setFormData({
      nombre: rol.nombre || "",
      descripcion: rol.descripcion || "",
      permisos: (rol.permisos || []).map((p) =>
        typeof p === "string" ? p : p._id
      ),
      activo: rol.activo ?? true,
    });
    setFormError(null);
    setShowForm(true);
  };

  // Manejo de inputs
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Checkbox de activo
    if (name === "activo" && type === "checkbox") {
      setFormData((s) => ({ ...s, activo: checked }));
      return;
    }

    // Textarea de permisos (IDs separados por comas)
    if (name === "permisos") {
      const arr = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      setFormData((s) => ({ ...s, permisos: arr }));
      return;
    }

    // Campos normales
    setFormData((s) => ({ ...s, [name]: value }));
  };

  // Guardar (crear/editar)
  const handleFormSubmit = async () => {
    setFormError(null);
    if (!formData.nombre?.trim() || !formData.descripcion?.trim()) {
      setFormError("Nombre y descripción son obligatorios");
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        permisos: formData.permisos,
        activo: formData.activo,
      };

      if (editing?._id) {
        await rolService.update(editing._id, payload);
      } else {
        await rolService.create(payload);
      }

      setShowForm(false);
      cargarRoles();
    } catch (err) {
      setFormError(err.message || "Error al guardar rol");
    } finally {
      setFormLoading(false);
    }
  };

  // Render
  return (
    <div className="providers-page professional">
      {/* Título y botón principal */}
      <div className="providers-header">
        <h2>Roles</h2>
        <Can permiso="ROL_CREATE">
          <button className="btn-primary" onClick={handleNuevo}>
            Nuevo rol
          </button>
        </Can>
      </div>

      {/* Buscador */}
      <form className="search" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Buscar rol..."
          value={query}
          onChange={onSearchChange}
          className="search-input"
        />
        <button
          type="button"
          className="search-clear"
          onClick={clearSearch}
        >
          Limpiar
        </button>
      </form>

      {/* Estados de carga / error */}
      {loading && <p className="muted">Cargando roles...</p>}
      {error && <p className="error">{error}</p>}

      {/* Lista de roles */}
      {!loading && !error && (
        <div className="providers-grid">
          {rolesFiltrados.length === 0 ? (
            <p className="muted">No hay roles que coincidan con la búsqueda.</p>
          ) : (
            rolesFiltrados.map((r) => (
              <div className="provider-card pro" key={r._id}>
                <div className="provider-card-header">
                  <span className="provider-id">ID: {r._id}</span>
                  <span
                    className={`role-badge ${
                      r.activo ? "role-badge-active" : "role-badge-inactive"
                    }`}
                  >
                    {r.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <div className="provider-card-body">
                  <h3>{r.nombre}</h3>
                  <p>{r.descripcion}</p>

                  {/* AQUÍ SE VEN LOS PERMISOS DEL ROL */}
                  <div className="role-permisos">
                    <span className="role-permisos-title">Permisos:</span>
                    {(r.permisos || []).length === 0 ? (
                      <span className="muted"> Sin permisos</span>
                    ) : (
                      <div className="role-permisos-tags">
                        {r.permisos.map((perm, idx) => {
                          const label =
                            typeof perm === "string"
                              ? perm
                              : perm.nombre || perm.codigo || perm._id;
                          return (
                            <span key={idx} className="role-perm-tag">
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="provider-card-actions">
                  <Can permiso="ROL_UPDATE">
                    <button className="btn edit" onClick={() => handleEditar(r)}>
                      Editar
                    </button>
                  </Can>
                  <Can permiso="ROL_DELETE">
                    <button
                      className="btn delete"
                      onClick={() => setDeleteId(r._id)}
                    >
                      Eliminar
                    </button>
                  </Can>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal formulario rol */}
      <Modal
        open={showForm}
        title={editing ? "Editar rol" : "Nuevo rol"}
        onClose={() => setShowForm(false)}
        onConfirm={handleFormSubmit}
        confirmText={formLoading ? "Guardando..." : "Guardar"}
        showCancel
      >
        <div className="provider-form">
          {formError && <p className="error">{formError}</p>}

          <label>Nombre del rol</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleFormChange}
          />

          <label>Descripción del rol</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleFormChange}
            rows={3}
          />

          <label>Permisos (IDs separados por comas)</label>
          <textarea
            name="permisos"
            value={formData.permisos.join(", ")}
            onChange={handleFormChange}
            rows={3}
          />

          <label className="role-activo-check">
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleFormChange}
            />
            Rol activo
          </label>
        </div>
      </Modal>

      {/* Modal eliminar rol */}
      <Modal
        open={!!deleteId}
        title="Eliminar rol"
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          await rolService.delete(deleteId);
          setDeleteId(null);
          cargarRoles();
        }}
        confirmText="Eliminar"
        showCancel
      >
        <p>¿Seguro que deseas eliminar este rol?</p>
      </Modal>
    </div>
  );
};

export default RolePage;
