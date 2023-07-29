const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const rooms = []

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    // socket.on('playerInput', (board, player) => {
    //     io.emit('boardChange', board, player)
    // });
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

    // rooms.forEach((room) => {
    //     socket.on('playerInput', (board, player) => {
    //         socket.to(room).emit('boardChange', board, player)
    //     })
    // })

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});