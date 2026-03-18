import React, { useState } from "react";
import PublicarPropiedad from "../components/PublicarPropiedad";

export default function PerfilArrendador(){

const [mostrarFormulario,setMostrarFormulario] = useState(false);

const [propiedades,setPropiedades] = useState([]);

return(
<div>

{/* BOTON NUEVA PROPIEDAD */}

<div className="header-propiedades">

<h2>Mis Propiedades</h2>

<button 
className="nueva-propiedad"
onClick={()=>setMostrarFormulario(true)}
>
+ Nueva Propiedad
</button>

</div>


{/* FORMULARIO */}

{mostrarFormulario && (
<PublicarPropiedad/>
)}


{/* LISTA DE PROPIEDADES */}

<div className="lista-propiedades">

{propiedades.length === 0 ? (

<p>No hay propiedades publicadas</p>

):(

propiedades.map((p,i)=>(
<div key={i} className="card-propiedad">

<img src={p.imagen} alt="propiedad"/>

<div>

<h3>{p.tipo}</h3>
<p>{p.zona}</p>

<span>{p.recamaras} rec.</span>
<span>{p.banos} baño(s)</span>

</div>

<div className="precio">

${p.precio}

</div>

</div>
))

)}

</div>

</div>
);
}