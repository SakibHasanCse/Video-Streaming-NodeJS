var express = require('express'),
    app = express(),
    http = require('http'),
    socketIo = require('socket'),
    fs = require('fs'),
    path = require('path'),
    server, io, sockets = [];

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname, '/src/views/index.html');

})


server = http.Server(app);
server.listen(5000);

io.on('connection', (socket) => {
    socket.emit('add-users', { users: sockets });
    socket.broadcast.emit('add-users', { users: [socket.id] });

    socket.on('make-offer', (data) => {
        socket.to(data.to).emit('offer-made', {
            offer: data.offer,
            socket: socket.id
        })
    });

    socket.on('make-answer', (data) => {

    })

})

