// src/modules/permits/pages/permsPage.jsx
import React, { useEffect, useState } from "react";
import { permisoService } from "../service/permsService";
import Modal from "../../product/components/Modal";
import "./permsStyle.css";
import { useSearch } from "../../product/hooks/useSearch";
import Can from "../../../components/can";
const PermsPage = () => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [editing, setEditing] = useState(null);


  const [formData, setFormData] = useState({
    nombre: "",
    recurso: "",
    accion: "",
    descripcion: "",
    activo: true,
  });

  const [deleteId, setDeleteId] = useState(null);

  // Buscador
  const {
    query,
    filteredItems: permisosFiltrados,
    onChange: onSearchChange,
    clear: clearSearch,
  } = useSearch(permisos, (p, q) => {
    const queryLower = q.toLowerCase();
    const id = String(p._id ?? p.id ?? "").toLowerCase();
    const nombre = String(p.nombre ?? "").toLowerCase();
    const recurso = String(p.recurso ?? "").toLowerCase();
    const accion = String(p.accion ?? "").toLowerCase();
    const descripcion = String(p.descripcion ?? "").toLowerCase();

    return (
      id.includes(queryLower) ||
      nombre.includes(queryLower) ||
      recurso.includes(queryLower) ||
      accion.includes(queryLower) ||
      descripcion.includes(queryLower)
    );
  });

  // Cargar permisos desde API
  const cargarPermisos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await permisoService.getAll();
      setPermisos(data || []);
    } catch (err) {
      setError(err.message || "Error al cargar permisos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPermisos();
  }, []);

  // Nuevo permiso
  const handleNuevo = () => {
    setEditing(null);
    setFormData({
      nombre: "",
      recurso: "",
      accion: "",
      descripcion: "",
      activo: true,
    });
    setFormError(null);
    setShowForm(true);
  };

  // Editar permiso
  const handleEditar = (permiso) => {
    setEditing(permiso);
    setFormData({
      nombre: permiso.nombre || "",
      recurso: permiso.recurso || "",
      accion: permiso.accion || "",
      descripcion: permiso.descripcion || "",
      activo: permiso.activo ?? true,
    });
    setFormError(null);
    setShowForm(true);
  };

  // Manejo de inputs
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "activo" && type === "checkbox") {
      setFormData((s) => ({ ...s, activo: checked }));
      return;
    }

    setFormData((s) => ({ ...s, [name]: value }));
  };

  // Guardar (crear/editar)
  const handleFormSubmit = async () => {
    setFormError(null);

    if ( !formData.recurso || !formData.accion) {
      setFormError("Nombre, recurso y acción son obligatorios");
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        nombre: formData.nombre,
        recurso: formData.recurso,
        accion: formData.accion,
        descripcion: formData.descripcion,
        activo: formData.activo,
      };

      if (editing?._id) {
        await permisoService.update(editing._id, payload);
      } else {
        await permisoService.create(payload);
      }

      setShowForm(false);
      cargarPermisos();
    } catch (err) {
      setFormError(err.message || "Error al guardar permiso");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="providers-page professional">
      {/* Header */}
      <div className="providers-header">
        <Can permiso="PERMISOS_CREATE">
        <h2>Permisos</h2>
            <button className="btn-primary" onClick={handleNuevo}>
            Nuevo permiso
            </button>
        </Can>
      </div>

      {/* Buscador */}
      <form className="search" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Buscar permiso..."
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

      {/* Estados */}
      {loading && <p className="muted">Cargando permisos...</p>}
      {error && <p className="error">{error}</p>}

      {/* Tabla de permisos */}
      {!loading && !error && (
        <>
          {permisosFiltrados.length === 0 ? (
            <p className="muted">
              No hay permisos que coincidan con la búsqueda.
            </p>
          ) : (
            <div className="table-container">
              <table className="perms-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Recurso</th>
                    <th>Acción</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <Can permisos={["PERMISOS_UPDATE", "PERMISOS_DELETE"]} mode="any">
                    <th style={{ width: "130px" }}>Acciones</th>
                    </Can>
                  </tr>
                </thead>
                <tbody>
                  {permisosFiltrados.map((p) => (
                    <tr key={p._id}>
                      <td className="cell-id">{p._id}</td>
                      <td>{p.nombre}</td>
                      <td>{p.recurso}</td>
                      <td>{p.accion}</td>
                      <td>{p.descripcion}</td>
                      <td>
                        <span
                          className={`role-badge ${
                            p.activo
                              ? "role-badge-active"
                              : "role-badge-inactive"
                          }`}
                        >
                          {p.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                        <Can permiso="PERMISOS_UPDATE">
                                <button
                                    className="btn btn-sm edit"
                                    onClick={() => handleEditar(p)}
                                >
                                    Editar
                                </button>
                        </Can>
                        <Can permiso="PERMISOS_DELETE">
                                <button
                                    className="btn btn-sm delete"
                                    onClick={() => setDeleteId(p._id)}
                                >
                                    Eliminar
                                </button>
                        </Can>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal formulario permiso */}
      <Modal
        open={showForm}
        title={editing ? "Editar permiso" : "Nuevo permiso"}
        onClose={() => setShowForm(false)}
        onConfirm={handleFormSubmit}
        confirmText={formLoading ? "Guardando..." : "Guardar"}
        showCancel
      >
        <div className="provider-form">
          {formError && <p className="error">{formError}</p>}

          <label>Recurso</label>
          <select
            name="recurso"
            value={formData.recurso}
            onChange={handleFormChange}
          >
            <option value="">Selecciona un recurso</option>
            <option value="PRODUCTO">PRODUCTO</option>
            <option value="PROVEEDOR">PROVEEDOR</option>
            <option value="USER">USER</option>
            <option value="ROL">ROL</option>
            <option value="PERMISOS">PERMISOS</option>
          </select>

          <label>Acción</label>
          <select
            name="accion"
            value={formData.accion}
            onChange={handleFormChange}
          >
            <option value="">Selecciona una acción</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="LIST">LIST</option>
          </select>

          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
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
            Permiso activo
          </label>
        </div>
      </Modal>

      {/* Modal eliminar permiso */}
      <Modal
        open={!!deleteId}
        title="Eliminar permiso"
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          await permisoService.delete(deleteId);
          setDeleteId(null);
          cargarPermisos();
        }}
        confirmText="Eliminar"
        showCancel
      >
        <p>¿Seguro que deseas eliminar este permiso?</p>
      </Modal>
    </div>
  );
};

export default PermsPage;
