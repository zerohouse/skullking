const _ = require('lodash');
const games = {};
const SkullKing = require('./skullking/skullking.game');

function SkullKingSocket(io) {
    io.on('connection', function (socket) {
        socket.emit('rooms', getRooms());
        socket.on('join', function (data) {
            socket.join(data.id);
            let game = games[data.id];
            if (!game) {
                socket.emit("err", "잘못된 접근입니다.");
                socket.disconnect();
                return;
            }
            let player = game.players.findById(data.player);
            if (!player) {
                socket.emit("err", "잘못된 접근입니다.");
                socket.disconnect();
                return;
            }
            if (!player.disconnected) {
                socket.emit("err", "이미 접속 중입니다.");
                socket.disconnect();
                return;
            }
            player.disconnected = false;
            player.socket = socket;
            socket.player = player;
            socket.game = game;
            socket.game.update();
        });

        socket.on('event', function (event) {
            try {
                if (event === 'startGame')
                    socket.game.start();
            }
            catch (e) {
                socket.emit("e", e.toString());
            }
            socket.game.update();
        });

        socket.on('playerEvent', function (event, no, arg2) {
            try {
                if (event === 'predict') {
                    socket.player.predict(socket.game, no);
                }
                else if (event === 'submit') {
                    socket.player.submit(socket.game, no, arg2);
                }
                else if (event === 'name') {
                    socket.player.name = no;
                }
            }
            catch (e) {
                socket.emit("e", e.toString());
            }
            socket.game.update();
        });

        socket.on('disconnect', function () {
            if (!socket.game)
                return;
            if (!socket.game.onGame) {
                socket.game.players.remove(socket.player);
                updateRooms();
                if (socket.game.players.length === 0) {
                    destroy(socket.game.id);
                } else if (socket.player.maker) {
                    socket.game.players[0].maker = true;
                }
            }
            else {
                socket.player.disconnected = true;
                socket.player.socket = undefined;
            }
            if (!socket.game.players.find(p => !p.disconnected)) {
                destroy(socket.game.id);
            }
            socket.game.update();
        });

        socket.on('chat', function (message) {
            message.name = socket.player.getName();
            socket.broadcast.to(socket.game.id).emit('chat', message);
        });
    });

    function destroy(id) {
        const game = games[id];
        if (!id || !game)
            return;
        game.destroy();
        delete games[id];
        updateRooms();
    }

    function updateRooms() {
        io.local.emit('rooms', getRooms());
    }

    function getRooms() {
        return _.map(games, function (v, k) {
            return {
                id: k,
                name: `${v.maker}님의 방`,
                size: v.players.length,
                maxSize: v.maxSize,
                createdAt: v.createdAt,
                onGame: v.onGame
            };
        });
    }
}

module.exports = {
    socket: SkullKingSocket,
    games: games
};