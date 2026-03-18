import React, { useEffect, useState } from "react";
import { rolService } from "../service/rolService";
import { permisoService } from "../../permits/service/permsService";
import Modal from "../../product/components/Modal";
import "./rolStyle.css";
import Can from "../../../components/can";
import { useSearch } from "../../product/hooks/useSearch";
import RoleFormModal from "../components/roleFormModal";

const RolePage = () => {

  const [roles, setRoles] = useState([]);
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);

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
    activo: true
  });

  const [deleteId, setDeleteId] = useState(null);

  // Buscador
  const {
    query,
    filteredItems: rolesFiltrados,
    onChange: onSearchChange,
    clear: clearSearch
  } = useSearch(roles, (r, q) => {

    const queryLower = q.toLowerCase();

    const id = String(r._id ?? "").toLowerCase();
    const nombre = String(r.nombre ?? "").toLowerCase();
    const descripcion = String(r.descripcion ?? "").toLowerCase();

    return (
      id.includes(queryLower) ||
      nombre.includes(queryLower) ||
      descripcion.includes(queryLower)
    );

  });

  // Cargar roles
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

  // Cargar permisos
  const cargarPermisos = async () => {

    try {

      const data = await permisoService.getAll();
      setPermisosDisponibles(data || []);

    } catch (err) {

      console.error("Error cargando permisos", err);

    }

  };

  useEffect(() => {
    cargarRoles();
    cargarPermisos();
  }, []);

  // Seleccionar permisos
  const togglePermiso = (id) => {

    setFormData((prev) => {

      const existe = prev.permisos.includes(id);

      return {
        ...prev,
        permisos: existe
          ? prev.permisos.filter((p) => p !== id)
          : [...prev.permisos, id]
      };

    });

  };

  const handleNuevo = () => {

    setEditing(null);

    setFormData({
      nombre: "",
      descripcion: "",
      permisos: [],
      activo: true
    });

    setShowForm(true);

  };

  const handleEditar = (rol) => {

    setEditing(rol);

    setFormData({
      nombre: rol.nombre || "",
      descripcion: rol.descripcion || "",
      permisos: (rol.permisos || []).map((p) =>
        typeof p === "string" ? p : p._id
      ),
      activo: rol.activo ?? true
    });

    setShowForm(true);

  };

  const handleFormChange = (e) => {

    const { name, value, type, checked } = e.target;

    if (name === "activo" && type === "checkbox") {

      setFormData((s) => ({ ...s, activo: checked }));
      return;

    }

    setFormData((s) => ({ ...s, [name]: value }));

  };

  const handleFormSubmit = async () => {

    setFormError(null);

    if (!formData.nombre || !formData.descripcion) {

      setFormError("Nombre y descripción son obligatorios");
      return;

    }

    setFormLoading(true);

    try {

      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        permisos: formData.permisos,
        activo: formData.activo
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

  return (

    <div className="providers-page professional">

      <div className="crud-actions">

        <div className="providers-header">
          <Can permiso="ROL_CREATE">
            <button
              className="btn btn-primary btn-md"
              onClick={handleNuevo}
            >
              Nuevo rol
            </button>
          </Can>
        </div>

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

      </div>

      {loading && <p className="muted">Cargando roles...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (

        <div className="providers-grid">

          {rolesFiltrados.map((r) => (

            <div className="card" key={r._id}>

              <div className="card-header">

                <span className="muted">
                  ID: {r._id}
                </span>

                <span className={`badge ${r.activo ? "badge-success" : "badge-danger"}`}>
                  {r.activo ? "Activo" : "Inactivo"}
                </span>

              </div>

              <div className="card-body">

                <h3 className="card-title">
                  {r.nombre}
                </h3>


                <p className="muted">
                  {r.descripcion}
                </p>

              </div>

              <div className="card-footer">

                <Can permiso="ROL_UPDATE">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditar(r)}
                  >
                    Editar
                  </button>
                </Can>

                <Can permiso="ROL_DELETE">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setDeleteId(r._id)}
                  >
                    Eliminar
                  </button>
                </Can>

              </div>

            </div>

          ))}

        </div>

      )}

      <RoleFormModal
        open={showForm}
        editing={editing}
        formData={formData}
        formError={formError}
        formLoading={formLoading}
        permisosDisponibles={permisosDisponibles}
        onClose={() => setShowForm(false)}
        onChange={handleFormChange}
        onTogglePermiso={togglePermiso}
        onSubmit={handleFormSubmit}
      />

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