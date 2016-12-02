module.exports = function (io, socket, game, room, nameSpace, explode) {
    if (!game.playing && game.users.length > 9) {
        socket.emit('over');
        return;
    }

    socket.on('reset', function (data) {
        if (data.password != 1234)
            return;
        game = new Game();
        io.of(nameSpace).to(room).emit('reset');
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
            socket.broadcast.to(room).emit('players', game.users);
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
        io.of(nameSpace).to(room).emit('game', game);
        io.of(nameSpace).to(room).emit('players', game.users);
    }

    socket.on('select', function (select) {
        if (!socket.user.king)
            return;
        if (select.length > game.maxSelect()) {
            io.of(nameSpace).to(room).emit('players', game.users);
            return;
        }
        game.users.forEach(user=>user.select = false);
        select.forEach(i=> {
            game.users[i].select = true;
        });
        io.of(nameSpace).to(room).emit('players', game.users);
    });

    socket.on('chat', function (message) {
        message.name = socket.user.name || ("플레이어" + (game.users.indexOf(socket.user) + 1));
        socket.broadcast.to(room).emit('chat', message);
    });


    socket.on('voteStart', function () {
        game.voteStart(socket.user);
        io.of(nameSpace).to(room).emit('players', game.users);
        io.of(nameSpace).to(room).emit('voteStart');
    });

    socket.on('vote', function (data) {
        socket.user.vote = data.vote;
        io.of(nameSpace).to(room).emit('players', game.users);
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

        if (game.missions.filter(function (m) {
                return m.result === 'fail'
            }).length > 2) {
            io.of(nameSpace).to(room).emit('evilWins', {type: 'fail'});
            return;
        }

        if (game.missions.filter(function (m) {
                return m.result === 'success'
            }).length > 2) {
            if (!game.merlin || !game.assasin)
                io.of(nameSpace).to(room).emit('goodWins');
            else
                io.of(nameSpace).to(room).emit('missionSuccess');
            return;
        }

        io.of(nameSpace).to(room).emit('missionResult', {result: result.success, fails: result.fails});
        io.of(nameSpace).to(room).emit('game', game);
        nextKing();
    }

    function endVote() {
        var result = game.endVote();
        io.of(nameSpace).to(room).emit('voteResult', {agree: result.agree, disagree: result.disagree});
        if (result.agree > result.disagree) {
            setTimeout(function () {
                io.of(nameSpace).to(room).emit('missionStart');
            }, 1000);
            return;
        }
        if (game.vote > 4) {
            io.of(nameSpace).to(room).emit('evilWins', {type: 'vote'});
            return;
        }
        nextKing();
    }

    function nextKing() {
        game.nextKing();
        io.of(nameSpace).to(room).emit('game', game);
        io.of(nameSpace).to(room).emit('players', game.users);
    }

    socket.on('user', function (data) {
        if (data.name)
            socket.user.name = data.name;
        if (data.avartar !== undefined)
            socket.user.avartar = data.avartar;
        io.of(nameSpace).to(room).emit('players', game.users);
    });


    socket.on('start', function () {
        game.start();
        io.of(nameSpace).to(room).emit('start');
        io.of(nameSpace).to(room).emit('players', game.users);
        io.of(nameSpace).to(room).emit('game', game);
    });

    socket.on('player', function () {
        socket.emit('player', socket.user);
    });

    socket.on('change', function (data) {
        var charactor = data.char;
        if (game[charactor]) {
            game[charactor] = false;
            io.of(nameSpace).to(room).emit('game', game);
            return;
        }
        if (charactor === 'merlin' || charactor === "percival") {
            game[charactor] = !game[charactor];
            io.of(nameSpace).to(room).emit('game', game);
            return;
        }
        if (game.getEvilCount() < game.getEvilSize()) {
            game[charactor] = true;
        }
        io.of(nameSpace).to(room).emit('game', game);
    });


    socket.on('disconnect', function (data) {
        if (!game)
            return;
        if (game.playing) {
            socket.user.disconnected = true;
            socket.broadcast.to(room).emit('players', game.users);
            if (!game.users.find(u=>!u.disconnected)) {
                explode(room);
                return;
            }
            return;
        }
        game.users.remove(socket.user);
        if (game.users.length === 0) {
            explode(room);
            return;
        }
        game.setMissions();
        io.of(nameSpace).to(room).emit('game', game);
        socket.broadcast.to(room).emit('players', game.users);
    });

};