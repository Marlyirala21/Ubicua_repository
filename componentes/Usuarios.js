import {React, useState, useEffect, useRef }  from "react";
import socket from "./cliente";
import "./Chat.css"

import { Link } from "react-router-dom";

function Usuarios({clientes}) {
    // const [clientes, setClientes] = useState([]);
    // useEffect(() => {
    //     socket.on('clientes', clientes => {
    //         setClientes(clientes);
    //     })
    // }, []);
    console.log(clientes);
    return (
      <div className="Usuarios">
          <div className="cabecera">
          <Link to="/"><button className="btn"> Chat General</button> </Link>   
          <h3>Usuarios conectados</h3>
          </div>
          <div className="usuariosConectados">
          {clientes.map((e,i) =>
            <li key={i}>
            {e}   <button>Enviar mensaje</button>
            </li>)}
          
          </div>
         
      
      </div>
    );
  }
  
  export default Usuarios;