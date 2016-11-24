var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var protos = require('./app/app.prototype');

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var users = [];
var game = new Game();

function Game() {
    this.round = 0;
    if (users.length > 4) {
        this.merlin = true;
        this.assasin = true;
    }
    if (users.length > 6) {
        this.percival = true;
        this.modred = true;
    }
    if (users.length > 9) {
        this.overon = true;
    }
    switch (users.length) {
        case 5:
            this.missions = [new Mission(2), new Mission(3), new Mission(2), new Mission(3), new Mission(3)];
            break;
        case 6:
            this.missions = [new Mission(2), new Mission(3), new Mission(4), new Mission(3), new Mission(4)];
            break;
        case 7:
            this.missions = [new Mission(2), new Mission(3), new Mission(3), new Mission(4, true), new Mission(4)];
            break;
        case 8:
            this.missions = [new Mission(3), new Mission(4), new Mission(4), new Mission(5, true), new Mission(5)];
            break;
        case 9:
            this.missions = [new Mission(3), new Mission(4), new Mission(4), new Mission(5, true), new Mission(5)];
            break;
        case 10:
            this.missions = [new Mission(3), new Mission(4), new Mission(4), new Mission(5, true), new Mission(5)];
            break;
        default:
            this.missions = [];
    }
}

function Mission(size, twoFailRequired) {
    this.size = size;
    this.twoFailRequired = twoFailRequired;
}

Game.prototype.start = function () {
    if (users.length < 5 || users.length > 10)
        return;
    this.playing = true;
    userReset();
    var king = users.random();
    king.king = true;
    game.king = users.indexOf(king);
    var chars = [];
    if (this.merlin)
        chars.push('merlin');
    if (this.percival)
        chars.push('percival');
    if (this.morgana)
        chars.push('morgana');
    if (this.modred)
        chars.push('modred');
    if (this.assasin)
        chars.push('assasin');
    if (this.overon)
        chars.push('overon');
    var evilSize = getEvilSize();
    for (var i = getEvilSize(this); i < evilSize; i++) {
        chars.push("evil");
    }
    for (var i = chars.length; i < users.length; i++) {
        chars.push("");
    }
    users.forEach(user=> {
        var state = chars.random();
        user.state = state;
        chars.remove(state);
    });
};

function userReset() {
    users.forEach(p=> {
        p.king = false;
        p.select = false
    });
}

Game.prototype.maxSelect = function () {
    return this.missions[this.round].size;
};

io.of('/ws').on('connection', function (socket) {
    socket.on('reset', function (data) {
        if (data.password != 1234)
            return;
        game = new Game();
        io.of('/ws').emit('reset');
    });
    socket.emit('id', {id: socket.id});
    var disconnected;
    if (users)
        disconnected = users.find(p=>p.disconnected);
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
            socket.broadcast.emit('players', users);
        }
        socket.emit('game', game);
        socket.emit('players', users);
    }
    else {
        socket.user = {};
        socket.user.id = socket.id;
        users.push(socket.user);
        socket.emit('players', users);
        game = new Game();
        game.evil = getEvilSize();
        io.of('/ws').emit('game', game);
    }

    socket.on('select', function (select) {
        if (!socket.user.king)
            return;
        if (select.length > game.maxSelect()) {
            io.of('/ws').emit('players', users);
            return;
        }
        users.forEach(user=>user.select = false);
        select.forEach(i=> {
            users[i].select = true;
        });
        io.of('/ws').emit('players', users);
    });

    socket.on('voteStart', function () {
        game.voting = true;
        socket.user.king = false;
        game.king = users.indexOf(socket.user);
        if (users.filter(p=>p.select).length !== game.maxSelect())
            return;
        users.forEach(u=> {
            u.vote = null;
        });
        io.of('/ws').emit('voteStart');
    });

    socket.on('vote', function (data) {
        socket.user.vote = data.vote;
        if (!users.find(u=>u.vote === null))
            endVote();
    });

    socket.on('mission', function (data) {
        socket.user.mission = data.mission;
        if (!users.find(u=>u.mission === null && u.select)) {
            endMission();
        }
    });

    function endMission() {
        var successes = users.filter(u=>u.select && u.mission).length;
        var fails = users.filter(u=>u.select && !u.mission).length;
        var success = fails == 0;
        if (game.missions[game.round].twoFailRequired) {
            success = fails < 2;
        }
        game.missions[game.round].result = success ? 'success' : 'fail';
        game.round++;
        game.missioning = false;
        game.reject = 0;
        io.of('/ws').emit('missionResult', {result: success, fails: fails});
        io.of('/ws').emit('game', game);
        nextKing();
    }

    function endVote() {
        var agree = users.filter(u=>u.vote).length;
        var disagree = users.filter(u=>!u.vote).length;
        io.of('/ws').emit('voteResult', {agree: agree, disagree: disagree});
        if (agree > disagree) {
            game.missioning = true;
            io.of('/ws').emit('missionStart');
            users.forEach(u=> {
                u.mission = null;
            });
            return;
        }
        nextKing();
    }

    function nextKing() {
        game.king++;
        if (game.king >= users.length)
            game.king = 0;
        users.forEach(user=> {
            user.king = false;
        });
        users[game.king].king = true;
        game.reject++;
        io.of('/ws').emit('game', game);
        io.of('/ws').emit('players', users);
    }

    socket.on('name', function (data) {
        socket.user.name = data.name;
        io.of('/ws').emit('players', users);
    });

    socket.on('start', function () {
        game.start();
        io.of('/ws').emit('players', users);
        io.of('/ws').emit('game', game);
    });

    socket.on('player', function () {
        socket.emit('player', socket.user);
    });

    socket.on('change', function (data) {
        var charactor = data.char;
        if (game[charactor]) {
            game[charactor] = false;
            io.of('/ws').emit('game', game);
            return;
        }
        if (charactor === 'merlin' || charactor === "percival") {
            game[charactor] = !game[charactor];
            io.of('/ws').emit('game', game);
            return;
        }
        if (getEvilSize(game) < getEvilSize()) {
            game[charactor] = true;
        }
        io.of('/ws').emit('game', game);
    });

    socket.on('disconnect', function () {
        if (game.playing) {
            socket.user.disconnected = true;
            socket.broadcast.emit('players', users);
            return;
        }
        users.remove(socket.user);
        game = new Game();
        game.evil = getEvilSize();
        io.of('/ws').emit('game', game);
        socket.broadcast.emit('players', users);
    });
});


function getEvilSize(game) {
    if (!game) {
        switch (users.length) {
            case 5:
                return 2;
            case 6:
                return 2;
            case 7:
                return 3;
            case 8:
                return 3;
            case 9:
                return 3;
            case 10:
                return 4;
        }
        return 0;
    }
    var size = 0;
    if (game.morgana)
        size++;
    if (game.assasin)
        size++;
    if (game.modred)
        size++;
    if (game.overon)
        size++;
    return size;
}


