import React from "react";
import Modal from "../../product/components/Modal";

const RoleFormModal = ({
  open,
  editing,
  formData,
  formError,
  formLoading,
  permisosDisponibles,
  onClose,
  onChange,
  onTogglePermiso,
  onSubmit
}) => {

  return (
    <Modal
      open={open}
      title={editing ? "Editar rol" : "Nuevo rol"}
      onClose={onClose}
      onConfirm={onSubmit}
      confirmText={formLoading ? "Guardando..." : "Guardar"}
      showCancel
    >
      <div className="provider-form">

        {formError && <p className="error">{formError}</p>}

        <label>Nombre del rol</label>
        <input
          name="nombre"
          value={formData.nombre}
          onChange={onChange}
        />

        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={onChange}
          rows={3}
        />

        <label>Seleccionar permisos</label>

        <div className="permisos-selector">

          {permisosDisponibles.length === 0 ? (
            <p>No hay permisos disponibles</p>
          ) : (
            permisosDisponibles.map((perm) => (
              <label key={perm._id} className="permiso-item">

                <input
                  type="checkbox"
                  checked={formData.permisos.includes(perm._id)}
                  onChange={() => onTogglePermiso(perm._id)}
                />

                {perm.nombre || `${perm.recurso}_${perm.accion}`}

              </label>
            ))
          )}

        </div>

        <label className="role-activo-check">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={onChange}
          />
          Rol activo
        </label>

      </div>
    </Modal>
  );
};

export default RoleFormModal;