const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const { v4: uuidv4 } = require('uuid');

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
})

const rooms = []

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html', {
        'Content-Type': 'application/javascript'
    });
});

io.on('connection', (socket) => {
    console.log('connected');

    socket.on('roomCreated', (roomId) => {
        if (rooms.includes(roomId)) {
            socket.join(roomId)
            socket.on('playerInput', (board, player) => {
                socket.to(roomId).emit('boardChange', board, player)
            })
        }
        else {
            rooms.push(roomId)
            socket.join(roomId)
            socket.on('playerInput', (board, player) => {
                socket.to(roomId).emit('boardChange', board, player)
            })
        }
    })

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});