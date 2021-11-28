import React from "react";
import './Chat.css'

function Mensaje({nombreChat, mensaje:{nombre, texto}}) {
   let isCurrentUser = false;

   if (nombreChat === nombre){
      isCurrentUser = true;
  } 
    return (
        
       isCurrentUser ? 
               (<div className="mensajeDcha">
                   {/* <p className="nombre">{nombre}</p> */}
                   <p className="textoDcha  color1">{texto}</p>
                  
                </div> )
              : 
              (<div className="mensajeIzq">
                   <p className="nombre">{nombre}</p>
                   <p className="textoIzq color2">{texto}</p> 
                
               </div>)
  
    );
  }
  
  export default Mensaje;