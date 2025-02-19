const express = require('express');
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("")));

io.on("connection", (socket) => {
    console.log("Connected");

    socket.on("right", (e) => {
        console.log(e);
    });

    socket.on("left", (e) => {
        console.log(e);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
