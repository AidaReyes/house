import React, { useState } from "react";
import "../pages/PerfilArrendador.css";

export default function PublicarPropiedad() {

const [form,setForm] = useState({
tipo:"",
precio:"",
zona:"",
recamaras:"",
banos:"",
tipoBano:"",
disponibilidad:"",
servicios:[],
telefono:"",
imagen:null
});

const [preview,setPreview] = useState(null);

const serviciosDisponibles = [
"WiFi",
"Agua",
"Luz",
"Gas",
"Estacionamiento",
"Semi amueblado",
"Cocina",
"Lavandería",
"Seguridad"
];

const toggleServicio = (servicio)=>{
if(form.servicios.includes(servicio)){
setForm({
...form,
servicios: form.servicios.filter(s => s !== servicio)
});
}else{
setForm({
...form,
servicios:[...form.servicios, servicio]
});
}
};

const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};

const handleImage = (e)=>{
const file = e.target.files[0];

if(file){
setForm({
...form,
imagen:file
});

setPreview(URL.createObjectURL(file));
}
};

const handleSubmit = (e)=>{
e.preventDefault();
console.log(form);
alert("Propiedad publicada");
};

return (

<div className="form-container">

<h2>Agregar Nueva Propiedad</h2>

<form onSubmit={handleSubmit}>

{/* TIPO */}

<label>Tipo de propiedad</label>
<select name="tipo" onChange={handleChange}>
<option>Seleccionar</option>
<option>Cuarto</option>
<option>Departamento</option>
<option>Casa</option>
</select>


{/* PRECIO */}

<label>Precio mensual</label>
<input
type="number"
name="precio"
placeholder="Ej: 2500"
onChange={handleChange}
/>


{/* ZONA */}

<label>Zona</label>
<select name="zona" onChange={handleChange}>
<option>Centro</option>
<option>Reforma</option>
<option>Zacualtipan Norte</option>
<option>Zacualtipan Sur</option>
</select>


{/* RECMARAS */}

<label>Recámaras</label>
<select name="recamaras" onChange={handleChange}>
<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
</select>


{/* BAÑOS */}

<label>Baños</label>
<select name="banos" onChange={handleChange}>
<option>1</option>
<option>2</option>
<option>3</option>
</select>


{/* TIPO DE BAÑO */}

<label>Tipo de baño</label>
<select name="tipoBano" onChange={handleChange}>
<option>Privado</option>
<option>Compartido</option>
</select>


{/* DISPONIBILIDAD */}

<label>Disponibilidad</label>
<select name="disponibilidad" onChange={handleChange}>
<option>Disponible</option>
<option>Ocupado</option>
</select>


{/* SERVICIOS */}

<label>Servicios incluidos</label>

<div className="servicios">

{serviciosDisponibles.map((s)=>(
<button
type="button"
key={s}
className={form.servicios.includes(s) ? "activo":""}
onClick={()=>toggleServicio(s)}
>
{s}
</button>
))}

</div>


{/* IMAGEN */}

<label>Imagen de la propiedad</label>

<input
type="file"
accept="image/*"
onChange={handleImage}
/>

{preview && (
<img
src={preview}
alt="preview"
style={{
width:"200px",
marginTop:"10px",
borderRadius:"8px"
}}
/>
)}


{/* TELEFONO */}

<label>Teléfono</label>
<input
type="text"
name="telefono"
placeholder="(771) 123-4567"
onChange={handleChange}
/>


<div className="botones">

<button type="submit" className="publicar">
Publicar Propiedad
</button>

<button type="button" className="cancelar">
Cancelar
</button>

</div>

</form>

</div>

);
}