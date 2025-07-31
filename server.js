const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const rooms = {};

const PORT = 3000;

app.use(cors({
    origin: "*"
}));

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

    socket.on('controller_opened', ({ roomId }) => {
        console.log(`Play na sala ${roomId}`);
        io.to(socket.id).emit("controller_opened"); // Envia evento para todos na sala
    });

    socket.on('move', (data) => {
        if (!socket.roomId) return;
        const room = rooms[socket.roomId];

        if (room && room.game) {
            room.game.emit('direction', data);
            console.log(socket.id);
        }
    });

    socket.on('game_over', (data) => {
        if (!socket.id) return;
        const room = rooms[socket.roomId];

        console.log(io.sockets.adapter.rooms);

        io.to(socket.id).emit("game_over");
        room.game.emit('game_over', data);
        console.log('Game Over:', socket.id);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
});
