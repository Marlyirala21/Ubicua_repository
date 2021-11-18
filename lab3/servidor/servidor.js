const express  = require('express');
const http = require('http');
const app = express();
const servidor = http.createServer(app);

const socketio = require('socket.io');
const io = socketio(servidor, {
    cors: {
      origin:  "*",
      methods: ["GET", "POST"]
    }
  });

io.on('connection', socket => {

    let nombre; 
    //cada vez que un cliente se conecta se ejecuta esta funcion (el socket se conecta a la transmision de conectado)
   
    socket.on('conectado', (nom) => {
        nombre = nom;
        //le mandamos el mensaje que un usuario ha entrada al chat a todos menos al que ha entrado
        socket.broadcast.emit('mensajes', {nombre: nombre, texto: `${nombre} ha entrado en el chat` });
        console.log("se ha conectado", nombre);
    }) 

    socket.on('mensaje',(nombre, texto) => {
        //enviamos al cliente el mensaje que le llega al servidor
        io.emit('mensajes', {nombre, texto});
        console.log(nombre, texto);
    })
 
    socket.on('disconnect', () => {
        io.emit('mensajes', {servidor: "Servidor", texto: `${nombre} ha abandonado en el chat` });
    })
})     
   
servidor.listen(3000,() => console.log("Servidor inicializado"));  