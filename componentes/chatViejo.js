import React, {useState, useEffect, useRef} from "react";
import socket from "./cliente";
import "../App.css"


const Chat = ({nombre}) => {
    const [mensaje, setMensaje] = useState("");
    const [mensajes, setMensajes] = useState([]);
    const [usuarios, setUsuarios] = useState([])

    //se ejecuta cuando cambie el nombre (cuando se conecta un nuevo usuario)
    useEffect(() => {
        socket.emit('conectado', nombre);
    }, [nombre]);

    useEffect(() => {
        socket.on('usuarios', usuario => {
            
            setUsuarios([...usuarios, usuario]);
        })    
    }, [usuarios]);

    useEffect( () => {
        socket.on('mensajes', mensaje => {
            setMensajes([...mensajes, mensaje]);
        })
          return() => {socket.off()}
    }, [mensajes]);

    const divRef = useRef(null);
    useEffect(() => {
        divRef.current.scrollIntoView({behavior: 'smooth'});
    })

    const submit = (e) =>{
        e.preventDefault();
     //le mandamos al servidor el mensaje
     if(mensaje !== ""){
        socket.emit('mensaje', nombre, mensaje)
        setMensaje("")
     }
        
    }

    return (
        <div>
        <div> <button><img src="https://img.icons8.com/material-outlined/24/000000/menu--v3.png"/></button> APLICACION CHAT</div>
        <div className = "mensajes">
            <div className="chat">
                {mensajes.map((e,i) => <div key={i}> <div> {e.nombre} </div>  <div> {e.mensaje} </div></div>)}
                <div ref={divRef}></div>
            </div>
            <form onSubmit={submit}>
                <textarea name= "" placeholder="Introduce tu mensaje" id="" cols = "45" rows="1" value = {mensaje} onChange = {e => setMensaje(e.target.value)}>

                </textarea>
                <button><img src="https://img.icons8.com/small/16/000000/filled-sent.png"/></button>
            </form>
        </div>
        </div>
     
    )
  
}

export default Chat;