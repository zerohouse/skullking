require('./prototype');
var Card = require('./skullking.cards');
var Round = require('./skullking.round');


function SkullKing(id) {
    this.id = id;
    this.madeAt = new Date();
    this.round = 0;
    this.rounds = [];
    this.players = [];
}

SkullKing.prototype.addPlayer = function (player) {
    if (this.players.length > 5)
        throw "플레이어가 너무 많습니다.";
    this.players.push(player);
};

SkullKing.prototype.nextRound = function () {
    this.round++;
    var first = this.getTurnPlayer();
    if (!first) {
        first = this.players.random();
        first.turn = true;
    }
    first.first = true;
    this.rounds.push(new Round(this.round, first.id, this.players.length, this));
    this.cards = Card.newSet();
    this.players.forEach(p => {
        p.nextRound(this);
    });
    this.phase = "prediction";
};

SkullKing.prototype.predictionDone = function (predictionDone) {
    if (!this.players.find(p => p.prediction === null)) {
        this.phase = "submit";
        predictionDone();
    }
};

SkullKing.prototype.submit = function (card, stepDone, roundDone) {
    this.rounds.last().submit(card, this, stepDone, roundDone);
};


SkullKing.prototype.allSubmit = function () {
    return !this.players.find(p => !p.submitCard);
};

SkullKing.prototype.getTurnPlayer = function () {
    return this.players.find(p => p.turn);
};

SkullKing.prototype.getNextPlayer = function () {
    var index = this.players.indexOf(this.getTurnPlayer());
    index++;
    if (index >= this.players.length)
        index = 0;
    return this.players[index];
};

SkullKing.prototype.start = function () {
    if (this.players.length < 2) {
        throw "게임 플레이어가 모자랍니다.";
    }
    this.onGame = true;
    this.nextRound();
};

SkullKing.prototype.nextTurn = function () {
    var next = this.getNextPlayer();
    var now = this.getTurnPlayer();
    next.turn = true;
    now.turn = false;
};

module.exports = SkullKing;