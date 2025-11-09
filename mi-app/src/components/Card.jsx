import React from 'react'
import {
    BiCodeAlt,
    BiServer,
    BiAtom,
    BiData,
    BiLinkAlt
} from "react-icons/bi";

export const cursos = [
  {
    titulo: "Introducción a JavaScript",
    duracion: "3 horas",
    icono: <BiCodeAlt/> // amarillo
  },
  {
    titulo: "Fundamentos de Node.js",
    duracion: "4 horas",
    icono: <BiServer/> // verde
  },
  {
    titulo: "Desarrollo con React",
    duracion: "5 horas",
    icono: <BiAtom/> // azul claro
  },
  {
    titulo: "Bases de Datos con MongoDB",
    duracion: "2.5 horas",
    icono: <BiData/> // verde oscuro
  },
  {
    titulo: "APIs RESTful",
    duracion: "3.5 horas",
    icono: <BiLinkAlt/> // azul
  }
];

const Card = () => {
    return (
        <div className='card--container'>
            {cursos.map((item)=>(
                <div className="card">
                    <div className="card--cover">{item.icono}</div>
                    <div className="card--title"><h2>{item.titulo}</h2></div>
                </div>
            ))}
        </div>
    )
}

export default Card