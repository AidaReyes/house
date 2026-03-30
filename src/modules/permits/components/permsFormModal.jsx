import React from "react";
import Modal from "../../product/components/Modal";

const PermFormModal = ({
  open,
  editing,
  formData,
  formError,
  formLoading,
  onClose,
  onChange,
  onSubmit
}) => {

  return (
    <Modal
      open={open}
      title={editing ? "Editar permiso" : "Nuevo permiso"}
      onClose={onClose}
      onConfirm={onSubmit}
      confirmText={formLoading ? "Guardando..." : "Guardar"}
      showCancel
    >
      <div className="provider-form">

        {formError && <p className="error">{formError}</p>}

        <label>Recurso</label>
        <select
          name="recurso"
          value={formData.recurso}
          onChange={onChange}
        >
          <option value="">Selecciona un recurso</option>
          <option value="PRODUCTO">PRODUCTO</option>
          <option value="PROVEEDOR">PROVEEDOR</option>
          <option value="USER">USER</option>
          <option value="ROL">ROL</option>
          <option value="PERMISOS">PERMISOS</option>
          <option value="RENT">RENT</option>
          <option value="ROOM">ROOM</option>
          <option value="SOLICITUD">SOLICITUD</option>
          <option value="PAGO">PAGO</option>
          <option value="COMMENT">COMMENT</option>
        </select>

        <label>Acción</label>
        <select
          name="accion"
          value={formData.accion}
          onChange={onChange}
        >
          <option value="">Selecciona una acción</option>
          <option value="CREATE">CREATE</option>
          <option value="READ">READ</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="LIST">LIST</option>
        </select>

        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={onChange}
          rows={3}
        />

        <label className="role-activo-check">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={onChange}
          />
          Permiso activo
        </label>

      </div>
    </Modal>
  );
};

export default PermFormModal;