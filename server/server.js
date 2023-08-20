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
const randomRooms = []

io.on('connection', (socket) => {
    //console.log('connected');


    socket.on('playerInput', (board, roomID) => {
        socket.to(roomID).emit('boardChange', board)
        //console.log(board, roomID)
    })



    //New Version

    socket.on('roomhost', id => {
        rooms.push(id)
        socket.join(id)
        io.to(socket.id).emit('roomJoined', {
            success: true,
            player: "X"
        })
        //console.log("Joined to " + id)
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
            //console.log("Joined to " + id)
        }
    })

    socket.on("random", (roomID) => {
        if (randomRooms[0] !== undefined && randomRooms[0] !== null) {
            socket.join(randomRooms[0])
            io.to(randomRooms[0]).emit("gameStarted", randomRooms[0])
            io.to(socket.id).emit('roomJoined', {
                success: true,
                player: "O"
            })
            //console.log("roomId: " + randomRooms[0])

            randomRooms[0] = undefined
        }
        else {
            randomRooms[0] = roomID
            socket.join(randomRooms[0])
            io.to(socket.id).emit('roomJoined', {
                success: true,
                player: "X"
            })
            //console.log("roomId: " + roomID)
        }

    })

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});