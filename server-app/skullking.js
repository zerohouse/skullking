require('./prototype');
var Card = require('./skullking.cards');
var Round = require('./skullking.round');
var _ = require('lodash');

function SkullKing(id) {
    this.id = id;
    this.madeAt = new Date();
    this.maxRounds = 10;
    this.players = [];
    this.cardsInGame = Card.newSet();
}

SkullKing.prototype.addPlayer = function (player) {
    if (this.players.length > 5)
        throw "플레이어가 너무 많습니다.";
    this.players.push(player);
};

SkullKing.prototype.doneGame = function () {
    this.onGame = false;
    this.phase = '';
    this.duetime = null;
    this.duration = null;
    clearTimeout(this.countEvent);
    this.alert(this.players
            .sort((p, p2) => {
                return p2.point - p.point;
            })
            .map((player, i) => {
                return `${i + 1}위 ${player.getName()} : ${player.point}`
            }).join("<br>"), "게임 결과");
};

SkullKing.prototype.nextRound = function (message, title) {
    this.round++;
    if (this.round > this.maxRounds) {
        this.doneGame();
        return;
    } else if (message)
        this.alert(message, title);

    var first = this.getTurnPlayer();
    if (!first) {
        first = this.players.random();
        first.turn = true;
    }
    first.first = true;
    this.rounds.push(new Round(this.round, first.id, this.players.length, this));
    this.cards = _.cloneDeep(this.cardsInGame);
    this.players.forEach(p => {
        p.nextRound(this);
    });
    this.phase = "prediction";
    this.pop(`${this.round} 라운드 예측하기`);
    this.countdown(20000, () => {
        this.players.filter(p => p.prediction === null).forEach(p => {
            p.predict(this, 0);
        });
    });
};

SkullKing.prototype.countdown = function (ms, cb) {
    this.duetime = new Date().getTime() + ms;
    this.duration = ms;
    clearTimeout(this.countEvent);
    this.countEvent = () => {
        try {
            cb();
            this.update();
        }
        catch (e) {
        }
    };
    setTimeout(this.countEvent, ms);
};

SkullKing.prototype.destroy = function () {
    clearTimeout(this.countEvent);
};

SkullKing.prototype.predictionDone = function () {
    if (!this.players.find(p => p.prediction === null)) {
        this.phase = "submit";
        this.alert(this.players.map((p, i) => {
            return `${p.getName()} : ${p.prediction}승 예측`
        }).join("<br>"), "예측 결과");
        this.nextTurn();
    }
};

SkullKing.prototype.alert = function (message, title) {
    this.players.forEach(p => p.alert(message, title));
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
};

SkullKing.prototype.nextTurn = function () {
    var now = this.getTurnPlayer();
    var next = !now.submitCard ? now : this.getNextPlayer();
    now.turn = false;
    next.turn = true;
    next.pop("카드를 낼 차례 입니다.");
    this.countdown(20000, () => {
        if (next.turn) {
            next.submit(this, next.submitable(this).id);
        }
    });
};

module.exports = SkullKing;