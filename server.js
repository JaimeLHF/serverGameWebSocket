const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const rooms = {};

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('<h1>Servidor WebSocket está rodando</h1>');
});

io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    socket.on('create-room', () => {
        const roomId = Math.random().toString(36).substring(2, 8); // ID aleatório
        rooms[roomId] = { controller: null, game: null };
        socket.emit('room-created', roomId);
        console.log(`Sala criada: ${roomId}`);
    });

    socket.on('join', ({ roomId, role }) => {
        if (rooms[roomId]) {
            rooms[roomId][role] = socket;
            socket.roomId = roomId;
            console.log(`${role} entrou na sala ${roomId}`);
        }
    });

    socket.on('move', (data) => {
        if (!socket.roomId) return;
        const room = rooms[socket.roomId];

        if (room && room.game) {
            room.game.emit('direction', data);
            console.log(`Movimento enviado para game: ${data}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
