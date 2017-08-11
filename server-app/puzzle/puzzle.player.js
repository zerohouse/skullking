const randomNames = require('./../skullking/skullking.constants.js').randomNames;
let name;
const _ = require('lodash');
const User = require('./../user/user.model');

function Player(id) {
    this.moves = [];
    this.id = id;
    name = this.name = randomNames.next(name);
    this.disconnected = true;
    this.score = 0;
}


Player.prototype.alert = function (message, title) {
    let socket = this.socket;
    if (!socket)
        return;
    if (typeof message === "object") {
        socket.emit('p', message);
        return;
    }
    if (title)
        socket.emit('p', `${title} : ${message}`);
    else
        socket.emit('p', `${message}`);
};


Player.prototype.update = function () {
    let socket = this.socket;
    if (!socket)
        return;
    const game = _.cloneDeepWith(socket.game, (value, key) => {
        if (key === "socket") {
            return false;
        }
        if (key === "countEvent") {
            return false;
        }
    });
    // const me = _.cloneDeepWith(this, (value, key) => {
    //     if (key === "socket") {
    //         return false;
    //     }
    // });
    game.timeAdjust = new Date().getTime();
    game.robots.forEach(r => r.game = null);
    socket.emit('game', game);
};

Player.prototype.getName = function () {
    return this.name;
};

Player.prototype.move = function (game, index, direction) {
    if (!game.proveTurn || !this.turn)
        return;
    const robot = game.robots[index];
    robot[['up', 'down', 'left', 'right'][direction]](this);
    game.update();
};

Player.prototype.short = function (game, number) {
    game.shorts.push({number: number, name: this.name, time: new Date().getTime(), player: this.id});
    game.shorts.sort((s1, s2) => {
        if (s1.number === s2.number)
            return s1.time - s2.time;
        return s1.number - s2.number
    });
    if (!game.duetime)
        game.countdown(60000, function () {
            game.prove();
        });
    game.update();
};


Player.prototype.noShort = function (game) {
    this.giveUp = true;
    if (!game.players.find(p => !p.giveUp))
        if (game.shorts.length > 0)
            game.prove();
        else
            game.nextSpot();
};

Player.prototype.proveTurn = function (short) {
    this.turn = true;
    this.moves = [];
    this.number = parseInt(short.number);
};

module.exports = Player;