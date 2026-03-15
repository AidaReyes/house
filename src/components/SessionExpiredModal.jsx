import React from "react";
import Modal from "../modules/product/components/Modal";

const SessionExpiredModal = ({ open, message, onConfirm }) => {

  return (

    <Modal
      open={open}
      title="Sesión expirada"
      onClose={onConfirm}
      onConfirm={onConfirm}
      confirmText="Ir al login"
    >

      <p>{message}</p>

    </Modal>

  );

};

export default SessionExpiredModal;