const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve('')));

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('right', (data) => {
    console.log('Recebido:', data);
    socket.emit('right', 'You moved to the right!');
  });

  socket.on('left', (data) => {
    console.log('Recebido:', data);
    socket.emit('teste_left', 'You moved to the left!');
  });

  socket.on('stop', (data) => {
    console.log('Stop event:', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
