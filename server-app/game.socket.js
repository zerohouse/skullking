module.exports = function (io, socket, game, socketUrl) {
    if (!game.playing && game.users.length > 9) {
        socket.emit('over');
        return;
    }
    socket.on('reset', function (data) {
        if (data.password != 1234)
            return;
        game = new Game();
        io.of(socketUrl).emit('reset');
    });
    socket.emit('id', {id: socket.id});
    var disconnected = game.getDisconnected();
    if (game.playing && !disconnected) {
        socket.emit('game', game);
        socket.emit('player', socket.user);
        return;
    }
    if (game.playing && disconnected) {
        if (disconnected) {
            socket.user = disconnected;
            socket.user.id = socket.id;
            socket.user.disconnected = false;
            socket.broadcast.emit('players', game.users);
        }
        socket.emit('game', game);
        socket.emit('players', game.users);
    }
    else {
        socket.user = {};
        socket.user.id = socket.id;
        game.users.push(socket.user);
        game.setMissions();
        socket.emit('players', game.users);
        io.of(socketUrl).emit('game', game);
    }

    socket.on('select', function (select) {
        if (!socket.user.king)
            return;
        if (select.length > game.maxSelect()) {
            io.of(socketUrl).emit('players', game.users);
            return;
        }
        game.users.forEach(user=>user.select = false);
        select.forEach(i=> {
            game.users[i].select = true;
        });
        io.of(socketUrl).emit('players', game.users);
    });

    socket.on('chat', function (message) {
        message.name = socket.user.name || ("플레이어" + (game.users.indexOf(socket.user) + 1));
        socket.broadcast.emit('chat', message);
    });


    socket.on('voteStart', function () {
        game.voteStart(socket.user);
        io.of(socketUrl).emit('players', game.users);
        io.of(socketUrl).emit('voteStart');
    });

    socket.on('vote', function (data) {
        socket.user.vote = data.vote;
        io.of(socketUrl).emit('players', game.users);
        if (!game.users.find(u=>u.vote === null))
            endVote();
    });

    socket.on('mission', function (data) {
        socket.user.mission = data.mission;
        if (!game.users.find(u=>u.mission === null && u.select)) {
            endMission();
        }
    });

    function endMission() {
        var result = game.endMission();
        io.of(socketUrl).emit('missionResult', {result: result.success, fails: result.fails});
        io.of(socketUrl).emit('game', game);
        nextKing();
    }

    function endVote() {
        var result = game.endVote();
        io.of(socketUrl).emit('voteResult', {agree: result.agree, disagree: result.disagree});
        if (result.agree > result.disagree) {
            setTimeout(function () {
                io.of(socketUrl).emit('missionStart');
            }, 1000);
            return;
        }
        nextKing();
    }

    function nextKing() {
        game.nextKing();
        io.of(socketUrl).emit('game', game);
        io.of(socketUrl).emit('players', game.users);
    }

    socket.on('name', function (data) {
        socket.user.name = data.name;
        io.of(socketUrl).emit('players', game.users);
    });

    socket.on('start', function () {
        game.start();
        io.of(socketUrl).emit('start');
        io.of(socketUrl).emit('players', game.users);
        io.of(socketUrl).emit('game', game);
    });

    socket.on('player', function () {
        socket.emit('player', socket.user);
    });

    socket.on('change', function (data) {
        var charactor = data.char;
        if (game[charactor]) {
            game[charactor] = false;
            io.of(socketUrl).emit('game', game);
            return;
        }
        if (charactor === 'merlin' || charactor === "percival") {
            game[charactor] = !game[charactor];
            io.of(socketUrl).emit('game', game);
            return;
        }
        if (game.getEvilCount() < game.getEvilSize()) {
            game[charactor] = true;
        }
        io.of(socketUrl).emit('game', game);
    });

    socket.on('disconnect', function () {
        if (game.playing) {
            socket.user.disconnected = true;
            socket.broadcast.emit('players', game.users);
            return;
        }
        game.users.remove(socket.user);
        game.setMissions();
        io.of(socketUrl).emit('game', game);
        socket.broadcast.emit('players', game.users);
    });
}