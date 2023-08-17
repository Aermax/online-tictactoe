const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

const rooms = []

io.on('connection', (socket) => {
    console.log('connected');


    socket.on('playerInput', (board, roomID) => {
        socket.to(roomID).emit('boardChange', board)
    })



    //New Version

    socket.on('roomhost', id => {
        rooms.push(id)
        socket.join(id)
        io.to(socket.id).emit('roomJoined', {
            success: true,
            player: "X"
        })
        console.log("Joined to " + id)
    })

    socket.on('roomJoin', id => {
        if (rooms.includes(id)) {
            rooms.splice(rooms.indexOf(id), 1)
            socket.join(id)
            io.to(id).emit("gameStarted")
            io.to(socket.id).emit('roomJoined', {
                success: true,
                player: "O"
            })
            console.log("Joined to " + id)
        }
    })

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});