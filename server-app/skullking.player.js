var randomNames = require('./skullking.constants').randomNames;
var _ = require('lodash');
function Player(id) {
    this.id = id;
    this.cards = [];
    this.win = 0;
    this.point = 0;
    this.points = [];
    this.name = randomNames.random();
}

Player.prototype.reset = function () {
    this.cards = [];
    this.win = 0;
    this.point = 0;
    this.points = [];
};

Player.prototype.nextRound = function (game) {
    for (var i = 0; i < game.round; i++)
        this.drawCard(game);
    this.win = 0;
    this.prediction = null;
    this.submitCard = null;
};

Player.prototype.drawCard = function (game) {
    var card = game.cards.random();
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
        this.error('제출 단계가 아닙니다.');
        return;
    }
    if (!this.turn) {
        this.error("내 차례가 아닙니다.");
        return;
    }
    var submitCard = this.cards.findById(id);
    if (!submitCard) {
        this.error("없는 카드입니다.");
        return;
    }
    if (submitCard.type.name === 'pirateOR') {
        if (arg2) {
            submitCard.type.pirate = true;
            submitCard.desc = "해적";
        } else {
            submitCard.type.white = true;
            submitCard.desc = "도망";
        }
    }
    if (!submitCard.type.item) {
        var prime = game.rounds.last().steps.last().prime;
        if (prime !== null && prime !== submitCard.type.name && this.cards.find(c => c.type.name === prime)) {
            this.error(`${prime} 타입의 일반 카드를 먼저 내야합니다.`);
            return;
        }
    }
    this.cards.remove(submitCard);
    this.submitCard = submitCard;
    game.submit(submitCard);
};

Player.prototype.predict = function (game, no) {
    if (game.phase !== "prediction") {
        this.error("예측 단계가 아닙니다.");
        return;
    }
    if (no < 0 || no > game.round) {
        this.error(`예측 범위는 0~${game.round}입니다.`);
        return;
    }
    if (isNaN(no)) {
        this.error('예측은 숫자로 해야 합니다.');
        return;
    }
    this.prediction = parseInt(no);
    game.predictionDone();
};

Player.prototype.addPoint = function (name, point) {
    this.point += point;
    this.points.push(new PointLog(name, point));
};

Player.prototype.update = function () {
    var socket = this.socket;
    if (!socket)
        return;
    var game = _.cloneDeepWith(socket.game, (value, key) => {
        if (key === "socket") {
            return false;
        }
    });
    var me = _.cloneDeepWith(this, (value, key) => {
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
    game.me = me;
    game.cards = null;
    socket.emit('game', game);
};

Player.prototype.submitable = function (game) {
    return this.cards.find(c => c.submitCheck(game, this.cards));
};

Player.prototype.alert = function (message) {
    var socket = this.socket;
    if (!socket)
        return;
    socket.emit('e', message);
};

Player.prototype.pop = function (message) {
    var socket = this.socket;
    if (!socket)
        return;
    socket.emit('p', message);
};

function PointLog(name, point) {
    this.name = name;
    this.point = point;
}

module.exports = Player;