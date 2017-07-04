require('./prototype');
var Card = require('./skullking.cards');
var Round = require('./skullking.round');


function SkullKing(id) {
    this.id = id;
    this.madeAt = new Date();
    this.maxRounds = 10;
    this.players = [];
}

SkullKing.prototype.addPlayer = function (player) {
    if (this.players.length > 5)
        throw "플레이어가 너무 많습니다.";
    this.players.push(player);
};

SkullKing.prototype.doneGame = function () {
    this.onGame = false;
    this.phase = '';
    this.alert("<b>게임이 종료되었습니다.</b><br><br>" + this.players
            .sort((p, p2) => {
                return p2.point - p.point;
            })
            .map((player, i) => {
                return `${i + 1}위 ${player.getName()} : ${player.point}`
            }).join("<br>"));
};

SkullKing.prototype.nextRound = function (message) {
    this.round++;
    if (this.round > this.maxRounds) {
        this.doneGame(message);
        return;
    } else if (message)
        this.alert(message);

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

SkullKing.prototype.predictionDone = function () {
    if (!this.players.find(p => p.prediction === null)) {
        this.phase = "submit";
        this.alert(this.players.map((p, i) => {
            return `${p.getName()} : ${p.prediction}승 예측`
        }).join("<br>"));
    }
};

SkullKing.prototype.alert = function (message) {
    this.players.forEach(p => p.alert(message));
};


SkullKing.prototype.pop = function (message) {
    this.players.forEach(p => p.pop(message));
};

SkullKing.prototype.update = function () {
    this.players.forEach(p => p.update());
};

SkullKing.prototype.submit = function (card) {
    this.rounds.last().submit(card, this);
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
    this.players.forEach(p => {
        p.reset();
    });
    this.round = 0;
    this.rounds = [];
    this.onGame = true;
    this.nextRound();
    this.pop("게임을 시작합니다.");
};

SkullKing.prototype.nextTurn = function () {
    var next = this.getNextPlayer();
    var now = this.getTurnPlayer();
    next.turn = true;
    now.turn = false;
};

module.exports = SkullKing;