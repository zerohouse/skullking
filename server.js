var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var protos = require('./app/app.prototype');
var SkullKing = require('./server-app/skullking');
var Player = require('./server-app/skullking.player');
var uuid = require('node-uuid');
var _ = require('lodash');

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var games = {};

io.on('connection', function (socket) {
    socket.on('join', function (data) {
        socket.join(data.id);
        var game = games[data.id];
        if (!game) {
            game = new SkullKing(data.id);
            games[data.id] = game;
        }
        var player = game.players.findById(data.player);
        if (game.onGame) {
            if (!player) {
                player = socket.player = {observer: true};
            } else {
                if (!player.disconnected) {
                    socket.emit("e", "이미 접속 중입니다.");
                    socket.disconnect();
                    return;
                }
                player.disconnected = false;
            }
        } else {
            if (player) {
                socket.emit("e", "이미 접속 중입니다.");
                socket.disconnect();
                return;
            }
            player = new Player(data.player);
            if (game.players.length === 0)
                player.maker = true;
            game.addPlayer(player);
        }
        player.socket = socket.id;
        socket.player = player;
        socket.game = game;
        updateGame(socket);
    });

    socket.on('event', function (event) {
        try {
            if (event === 'startGame')
                socket.game.start();
        }
        catch (e) {
            socket.emit("e", e.toString());
        }
        updateGame(socket);
    });

    socket.on('playerEvent', function (event, no, arg2) {
        try {
            if (event === 'predict') {
                socket.player.predict(socket.game, no, function () {
                    alertRoom(socket, socket.game.players.map((p, i) => {
                        return `${p.getName()} : ${p.prediction}승 예측`
                    }).join("<br>"));
                });
            }
            else if (event === 'submit') {
                socket.player.submit(socket.game, no, function (message) {
                    alertRoom(socket, message);
                }, function (message) {
                    alertRoom(socket, message);
                }, arg2);
            }
            else if (event === 'name') {
                socket.player.name = no;
            }
        }
        catch (e) {
            socket.emit("e", e.toString());
        }
        updateGame(socket);
    });

    socket.on('disconnect', function () {
        if (!socket.game)
            return;
        if (!socket.game.onGame) {
            socket.game.players.remove(socket.player);
            if (socket.game.players.length === 0) {
                delete games[socket.game.id];
            } else if (socket.player.maker) {
                socket.game.players[0].maker = true;
            }
        }
        else
            socket.player.disconnected = true;
        if (!socket.game.players.find(p => !p.disconnected))
            delete games[socket.game.id];
        updateGame(socket);
    });

    socket.on('chat', function (message) {
        message.name = socket.player.getName();
        socket.broadcast.to(socket.game.id).emit('chat', message);
    });

});

function alertRoom(socket, message) {
    io.in(socket.game.id).emit('e', message);
}

function updateGame(socket) {
    if (!socket.game || !socket.game.id)
        return;
    socket.game.players.forEach(player => {
        var game = _.cloneDeep(socket.game);
        game.players.forEach(p => {
            p.cards = undefined;
            p.name = p.getName();
            if (game.phase === "prediction")
                p.prediction = p.prediction !== null;
        });
        game.me = player;
        game.cards = null;
        io.in(player.socket).emit('game', game);
    });
}