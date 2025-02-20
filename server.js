const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('<h1>Servidor WebSocket está rodando</h1>');
});

io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    socket.on('move', (direction) => {
        console.log(`Direção: ${direction}`);
        io.emit('direction', direction);
    })

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});