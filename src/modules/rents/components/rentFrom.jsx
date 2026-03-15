import React, { useEffect, useState } from "react";
import Modal from "../../product/components/Modal";
import { rentService } from "../service/rents.service";
import userService from "../../user/service/user.service";
// import Service from "../../room/service/roomsService";

const RentFormModal = ({ open, onClose, editing, onSaved }) => {

  const [usuarios,setUsuarios] = useState([]);
//   const [cuartos,setCuartos] = useState([]);

  const [formData,setFormData] = useState({
    fechainicio:"",
    fechafin:"",
    usuario:"",
    cuarto:"",
    status:true
  });

  useEffect(()=>{

    const cargarDatos = async()=>{

      const users = await userService.getAll();
    //   const rooms = await roomsService.getAll();

      setUsuarios(users || []);
    //   setCuartos(rooms || []);

    };

    cargarDatos();

  },[]);


  useEffect(()=>{

    if(editing){

      setFormData({
        fechainicio:editing.fechainicio?.slice(0,10),
        fechafin:editing.fechafin?.slice(0,10),
        usuario:editing.usuario?._id || editing.usuario,
        cuarto:editing.cuarto?._id || editing.cuarto,
        status:editing.status === "activa"
      });

    }

  },[editing]);

  const handleChange = (e)=>{

    const {name,value,type,checked} = e.target;

    setFormData((s)=>({
      ...s,
      [name]: type === "checkbox" ? checked : value
    }));

  };

  const guardar = async()=>{

    const data = {
      ...formData,
      status: formData.status ? "activa" : "cancelada"
    };

    if(editing){
      await rentService.update(editing._id,data);
    }else{
      await rentService.create(data);
    }

    onSaved();
    onClose();

  };

  return(

    <Modal
      open={open}
      title={editing ? "Editar renta" : "Nueva renta"}
      onClose={onClose}
      onConfirm={guardar}
      confirmText="Guardar"
      showCancel
    >

      <div className="rent-form">

        <label>Fecha inicio</label>
        <input
          type="date"
          name="fechainicio"
          value={formData.fechainicio}
          onChange={handleChange}
        />

        <label>Fecha fin</label>
        <input
          type="date"
          name="fechafin"
          value={formData.fechafin}
          onChange={handleChange}
        />

        <label>Usuario</label>
        <select
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
        >

          <option value="">Seleccionar usuario</option>

          {usuarios.map((u)=>(
            <option key={u._id} value={u._id}>
              {u.nombre}
            </option>
          ))}

        </select>

        <label>Cuarto</label>
        <select
          name="cuarto"
          value={formData.cuarto}
          onChange={handleChange}
        >

          <option value="">Seleccionar cuarto</option>

          {cuartos.map((c)=>(
            <option key={c._id} value={c._id}>
              {c.nombre || c.numero}
            </option>
          ))}

        </select>

        <label className="checkbox">

          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
          />

          Renta activa

        </label>

      </div>

    </Modal>

  );

};

export default RentFormModal;