const randomNames = require('./skullking.constants.js').randomNames;
let name;
const _ = require('lodash');
const User = require('./../user/user.model');

function Player(id) {
    this.id = id;
    this.cards = [];
    this.win = 0;
    this.point = 0;
    this.points = [];
    this.disconnected = true;
    this.predictions = [];
    name = this.name = randomNames.next(name);
}

Player.prototype.saveResult = function (length) {
    if (!this.userId)
        return;
    User.findById(this.userId, (err, user) => {
        user.point += this.point;
        user.ranks.push({rank: this.rank, players: length});
        user.save(function (err, user) {
        });
    });
};

Player.prototype.reset = function () {
    this.cards = [];
    this.win = 0;
    this.point = 0;
    this.points = [];
};

Player.prototype.nextRound = function (game) {
    for (let i = 0; i < game.round; i++)
        this.drawCard(game);
    this.win = 0;
    this.prediction = null;
    this.submitCard = null;
};


Player.prototype.drawCard = function (game) {
    let card = game.cards.random();
    if (!card) {
        game.newCardsSet();
        card = game.cards.random();
    }
    card.player = this.id;
    this.cards.push(card);
    game.cards.remove(card);
};

Player.prototype.error = function (word) {
    throw word;
};

Player.prototype.getName = function () {
    return this.name;
};

Player.prototype.submit = function (game, id, arg2) {
    if (game.phase !== "submit") {
        this.error('Not a submission step.');
        return;
    }
    if (!this.turn) {
        this.error("Not your turn.");
        return;
    }
    let submitCard = this.cards.findById(id);
    if (!submitCard) {
        this.error("Card is already removed.");
        return;
    }
    if (submitCard.type.name === 'pirateOR') {
        if (arg2) {
            submitCard.type.pirate = true;
            submitCard.name = "pirate";
        } else {
            submitCard.type.white = true;
            submitCard.name = "escape";
        }
    }
    if (!submitCard.type.item) {
        const prime = game.rounds.last().steps.last().prime;
        if (prime !== null && prime !== submitCard.type.name && this.cards.find(c => c.type.name === prime)) {
            this.error(`You must submit ${prime} type card first.`);
            return;
        }
    }
    this.cards.remove(submitCard);
    this.submitCard = submitCard;
    game.submit(submitCard);
};

Player.prototype.predict = function (game, no) {
    if (game.phase !== "prediction") {
        this.error("Not a prediction step.");
        return;
    }
    if (no < 0 || no > game.round) {
        this.error(`Prediction range is 0~${game.round}.`);
        return;
    }
    if (isNaN(no)) {
        this.error('Prediction is number.');
        return;
    }
    this.prediction = parseInt(no);
    this.predictions[game.round] = this.prediction;
    game.predictionDone();
};

Player.prototype.addPoint = function (name, point) {
    this.point += point;
    this.points.push(new PointLog(name, point));
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
    const me = _.cloneDeepWith(this, (value, key) => {
        if (key === "socket") {
            return false;
        }
    });
    game.players.forEach(p => {
        p.cards = undefined;
        p.name = p.getName();
        if (game.phase === "prediction")
            p.prediction = p.prediction !== null;
    });
    game.timeAdjust = new Date().getTime();
    game.me = me;
    game.cards = null;
    socket.emit('game', game);
};

Player.prototype.submitable = function (game) {
    return this.cards.find(c => c.submitCheck(game, this.cards));
};

Player.prototype.alert = function (message, title) {
    let socket = this.socket;
    if (!socket)
        return;
    if (typeof message === "object") {
        socket.emit('e', message);
        return;
    }
    socket.emit('e', `<h3>${title}</h3>${message}`);
};

Player.prototype.pop = function (message) {
    let socket = this.socket;
    if (!socket)
        return;
    socket.emit('p', message);
};

function PointLog(name, point) {
    this.name = name;
    this.point = point;
}

module.exports = Player;