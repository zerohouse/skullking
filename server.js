var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var protos = require('./app/app.prototype');
var Game = require('./server-app/game');
var GameSocket = require('./server-app/game.socket');
var uuid = require('node-uuid');
var _ = require('lodash');

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var nameSpace = '/ws';
var url = require('url');
var games = {};
io.of(nameSpace).on('connection', function (socket) {
    socket.emit('rooms', getRooms());

    socket.on('rooms', function () {
        socket.emit('rooms', getRooms());
    });

    socket.on('join', function (data) {
        var id = data.id;
        var game = games[id];
        if (!game) {
            game = new Game();
            game.id = id;
            game.name = data.name;
            games[id] = game;
        }
        socket.join(id);
        
        GameSocket(io, socket, game, id, nameSpace, function (room) {
            delete games[room];
        });
    });

    
});

function getRooms() {
    var rooms = [];
    _.forEach(games, function (v) {
        rooms.push({id: v.id, size: v.users.length, name: v.name, host: v.users[0].name});
    });
    return rooms;
}