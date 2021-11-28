import {React, useState, useEffect, useRef }  from "react";
import socket from "./cliente";
import "./Chat.css"
import "./InfoBar.css"
import InfoBar from "./InfoBar";
import Mensaje from "./Mensaje";
import Usuarios from "./Usuarios";

const Chat = ({nombreChat}) => { 

    const [texto, setTexto] = useState("");
    const [mensajes, setMensajes] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [mandaMensaje, setMandaMensaje] = useState(nombreChat);
    
    useEffect(() => {
        socket.emit('conectado', nombreChat);
        socket.on('clientes', clientes => {
            setClientes(clientes);
            console.log("clientes", clientes);
        })
    }, []);

    useEffect( () => {
        socket.on('mensajes', mensaje => {
            setMensajes([...mensajes, mensaje]);
            setMandaMensaje(mensaje.nombre);
            // console.log("mensaje", mensaje);            
        })
        return() => {socket.off()}
    }, [mensajes]);

    console.log("mandaMensaje", mandaMensaje);
    

    const divRef = useRef(null);
    useEffect(() => {
        divRef.current.scrollIntoView({behavior: 'smooth'});
    })

    const submit = (e) =>{
        e.preventDefault();
     //le mandamos al servidor el mensaje
     if(texto){
        socket.emit('mensaje', nombreChat, texto)
        setTexto("")
     }    
    }
    
    // let isCurrentUser = false;
    // console.log("el usuario del chat es ", nombre, "y el que envia el mensaje es" , mandaMensaje)
//    console.log("el nombre del chat tiene que ser fijo: ", nombre);
//    console.log("El que envia el mensaje puede cambiar:", mandaMensaje);
    
  
    return (
            <div className= "wrapper">
                <InfoBar className="InfoBar"/>
                    <div className="chat">
                        {mensajes.map((e,i) =>
                         <div key={i}>
                            <Mensaje nombreChat={nombreChat} mensaje={e}/> 
                        </div>)}
                    <div ref={divRef}></div>
                    </div>
                    
                    <form>
                        <input className = "input" placeholder="Introduce tu mensaje" value = {texto} onChange = {e => setTexto(e.target.value)} />
                        <button className="enviar" onClick={e => submit(e)}>Enviar</button>
                    </form> 
                    

                   
            </div>
        
    
    ) 
}

export default Chat;
