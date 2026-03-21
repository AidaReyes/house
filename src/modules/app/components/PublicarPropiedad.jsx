import "../pages/PerfilArrendador.css";
import  { useEffect, useState } from "react";

export default function PublicarPropiedad({ agregarPropiedad, cerrar }) {

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
imagen: URL.createObjectURL(file) // 🔥 guardamos preview directamente
});

setPreview(URL.createObjectURL(file));
}
};

const handleSubmit = (e)=>{
e.preventDefault();

agregarPropiedad(form); // 🔥 manda datos al padre

alert("Propiedad publicada");
};

return (

<div className="form-container">

<h2>Agregar Nueva Propiedad</h2>

<form onSubmit={handleSubmit}>

<label>Tipo de propiedad</label>
<select name="tipo" onChange={handleChange}>
<option>Seleccionar</option>
<option>Cuarto</option>
<option>Departamento</option>
<option>Casa</option>
</select>

<label>Precio mensual</label>
<input
type="number"
name="precio"
onChange={handleChange}
/>

<label>Zona</label>
<select name="zona" onChange={handleChange}>
<option>Centro</option>
<option>Loma bonita</option>
<option>Santa celicia</option>
<option>Cosapa</option>
</select>

<label>Recámaras</label>
<select name="recamaras" onChange={handleChange}>
<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
</select>

<label>Baños</label>
<select name="banos" onChange={handleChange}>
<option>1</option>
<option>2</option>
<option>3</option>
</select>

<label>Tipo de baño</label>
<select name="tipoBano" onChange={handleChange}>
<option>Privado</option>
<option>Compartido</option>
</select>

<label>Disponibilidad</label>
<select name="disponibilidad" onChange={handleChange}>
<option>Disponible</option>
<option>Ocupado</option>
</select>

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

<label>Teléfono</label>
<input
type="text"
name="telefono"
onChange={handleChange}
/>

<div className="botones">

<button type="submit" className="btn btn-sm btn-primery">
Publicar Propiedad
</button>

<button 
type="button" 
className="btn btn-sm btn-primery"
onClick={cerrar} // 🔥 cerrar formulario
>
Cancelar
</button>

</div>

</form>

</div>

);
}