var express = require('express'),
    app = express(),
    http = require('http'),
    socketIo = require('socket.io'),
    fs = require('fs'),
    path = require('path');

const VideoRouter = require('./src/router')


app.use('/', VideoRouter);

const port = process.env.PORT || 8000;
app.listen(port, function () {
    console.log('server listing on port ' + port);
});

