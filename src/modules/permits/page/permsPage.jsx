import React, { useEffect, useState } from "react";
import { permisoService } from "../service/permsService";
import Modal from "../../product/components/Modal";
import { useSearch } from "../../product/hooks/useSearch";
import Can from "../../../components/can";
import PermFormModal from "../components/permsFormModal";

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
    activo: true
  });

  const [deleteId, setDeleteId] = useState(null);

  const {
    query,
    filteredItems: permisosFiltrados,
    onChange: onSearchChange,
    clear: clearSearch
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

  const handleNuevo = () => {

    setEditing(null);

    setFormData({
      nombre: "",
      recurso: "",
      accion: "",
      descripcion: "",
      activo: true
    });

    setFormError(null);
    setShowForm(true);

  };

  const handleEditar = (permiso) => {

    setEditing(permiso);

    setFormData({
      nombre: permiso.nombre || "",
      recurso: permiso.recurso || "",
      accion: permiso.accion || "",
      descripcion: permiso.descripcion || "",
      activo: permiso.activo ?? true
    });

    setFormError(null);
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

    if (!formData.recurso || !formData.accion) {

      setFormError("Recurso y acción son obligatorios");
      return;

    }

    setFormLoading(true);

    try {

      const payload = {
        nombre: formData.nombre,
        recurso: formData.recurso,
        accion: formData.accion,
        descripcion: formData.descripcion,
        activo: formData.activo
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
        <div className="crud-actions">

          <div className="providers-header">
            <Can permiso="PERMISOS_CREATE">
              <button
                className="btn btn-primary"
                onClick={handleNuevo}
              >
                Nuevo permiso
              </button>
            </Can>
          </div>

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

        </div>
        {loading && <p className="muted">Cargando permisos...</p>}
        {error && <p className="error">{error}</p>}

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
                      <th>Nombre</th>
                      <th>Recurso</th>
                      <th>Acción</th>
                      <th>Descripción</th>
                      <th>Estado</th>

                      <Can permisos={["PERMISOS_UPDATE", "PERMISOS_DELETE"]} mode="any">
                        <th>Acciones</th>
                      </Can>

                    </tr>
                  </thead>

                  <tbody>

                    {permisosFiltrados.map((p) => (

                      <tr key={p._id}>

                        <td>{p.nombre}</td>
                        <td>{p.recurso}</td>
                        <td>{p.accion}</td>
                        <td>{p.descripcion}</td>


                        <td>
                          <span
                            className={`role-badge ${p.activo
                              ? "role-badge-active"
                              : "role-badge-inactive"
                              }`}
                          >
                            {p.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>

                        <td>

                          <div className="actions">

                            <Can permiso="PERMISOS_UPDATE">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleEditar(p)}
                              >
                                Editar
                              </button>
                            </Can>

                            <Can permiso="PERMISOS_DELETE">
                              <button
                                className="btn btn-sm btn-danger"
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

        <PermFormModal
          open={showForm}
          editing={editing}
          formData={formData}
          formError={formError}
          formLoading={formLoading}
          onClose={() => setShowForm(false)}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
        />

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