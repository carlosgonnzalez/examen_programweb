import express from 'express';
import http from 'http';
import { Server as ServidorSocket } from 'socket.io';
import axios from 'axios';

const app = express();
const server = http.createServer(app);
const io = new ServidorSocket(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});

let juegos = {};

io.on('connection', socket => {
    console.log('Cliente conectado');

    socket.on('crear-juego', async ({ salaId, playerName }) => {
        socket.join(salaId);
        const palabraAleatoria = await obtenerPalabraAleatoria() || generarPalAle(); // ESTO OBTIENE UNA PALABRA DE LA API
        juegos[salaId] = {                                                           //Y EN EL CASO DE UN ERROR, UTILIZA UNA RESERVA
            palabra: palabraAleatoria,                                               //DE PALABRAS EN LOCAL
            letrasUsadas: [],
            errores: 0,
            aciertos: 0,
            anfitrionId: socket.id,
            anfitrionNombre: playerName
        };
        console.log(`Juego creado con ID de sala: ${salaId} por el anfitrión ${socket.id}`);
        socket.emit('sala-creada', juegos[salaId]);
    });

    socket.on('unirse-juego', ({ salaId, playerName }) => {
        socket.join(salaId);
        if (juegos[salaId]) {
            const esAnfitrion = juegos[salaId].anfitrionId === socket.id;
            const estadoJuegoConAnfitrion = {
                ...juegos[salaId],
                esAnfitrion: esAnfitrion
            };
            socket.emit('estado-actual', estadoJuegoConAnfitrion);
        }
    });

    socket.on('iniciar-juego', ({ salaId }) => {
        io.to(salaId).emit('partida-iniciada', juegos[salaId]);
        console.log(`Juego iniciado en sala: ${salaId}`);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
    
    socket.on('adivinar-letra', ({ letra, salaId }) => {
        if (juegos[salaId]) {
            const juego = juegos[salaId];
    
            if (!juego.letrasUsadas.includes(letra.toUpperCase())) {
                juego.letrasUsadas.push(letra.toUpperCase());
    
                if (juego.palabra.includes(letra.toUpperCase())) {
                    juego.aciertos += juego.palabra.split('').filter(l => l === letra.toUpperCase()).length;
                    if (!juego.palabra.split('').some(l => !juego.letrasUsadas.includes(l))) {
                        juego.ganador = true; 
                    }
                } else {
                    juego.errores += 1;
                }
    
                io.to(salaId).emit('estado-actual', juego);
            }
        }
    });

    socket.on('iniciar-nueva-partida', ({ salaId }) => {
        if (juegos[salaId] && juegos[salaId].anfitrionId === socket.id) {
            juegos[salaId].letrasUsadas = [];
            juegos[salaId].errores = 0;
            juegos[salaId].aciertos = 0;
            juegos[salaId].palabra = generarPalAle(); 
            const esAnfitrion = juegos[salaId].anfitrionId === socket.id;
            const estadoJuegoActualizado = {
            ...juegos[salaId],
            esAnfitrion: esAnfitrion
            };
            io.to(salaId).emit('estado-actual', estadoJuegoActualizado);
        }
    });
    
});

function generarPalAle() {
    //RESERVA DE PALABRAS EN CASO DE ERROR DE API
    let palabras = ["EJEMPLO", "AHORCADO", "JUEGO", "PALABRA", "MARTILLO", "LICUADORA", "MURCIELAGO",
    "VENTILADOR", "CHOCOLATE", "BICICLETA", "FINISIMO"];
    return palabras[Math.floor(Math.random() * palabras.length)];
}

const obtenerPalabraAleatoria = async () => {
    try {
        const respuesta = await axios.get('https://pow-3bae6d63ret5.deno.dev/word');
        const palabra = respuesta.data.word; 
        return palabra.toUpperCase(); 
    } catch (error) {
        console.error('Error al obtener palabra aleatoria:', error);
        return null; 
    }
};

server.listen(4000);
console.log('Server on port', 4000);
