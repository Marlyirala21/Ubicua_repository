import React from "react";
import { Link } from "react-router-dom";

import './InfoBar.css'

function InfoBar() {
    return (
      <div className="InfoBar">
          <div className="cabecera">
           <Link to="/usuarios"><button className="btn"> Usuarios conectados</button> </Link>
            
            <h3>Chat General</h3>
          </div>
          
      
      </div>
    );
  }
  
  export default InfoBar;