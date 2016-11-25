var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var protos = require('./app/app.prototype');
var Game = require('./server-app/game');
var GameSocket = require('./server-app/game.socket');

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var game = new Game();

var socketUrl = '/ws';

io.of(socketUrl).on('connection', function (socket) {
    GameSocket(io, socket, game, socketUrl);
});

