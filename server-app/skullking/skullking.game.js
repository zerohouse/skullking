const Card = require('./skullking.cards');
const Round = require('./skullking.round');
const Player = require('./skullking.player');
const _ = require('lodash');
const GameResult = require('./skullking.result.model');
const moment = require('moment');

function SkullKing(id, options) {
    this.type = 'skullking';
    this.id = id;
    this.name = options.name;
    this.password = options.password ? options.password : null;
    this.createdAt = new Date().getTime();
    this.maxRounds = isNaN(options.maxRounds) ? 10 : parseInt(options.maxRounds);
    if (this.maxRounds < 6)
        this.maxRounds = 10;
    this.maxSize = isNaN(options.maxSize) ? 6 : parseInt(options.maxSize);
    this.submitLimitTime = isNaN(options.submitLimitTime) ? 30000 : parseInt(options.submitLimitTime) * 1000;
    this.predictLimitTime = isNaN(options.predictLimitTime) ? 30000 : parseInt(options.predictLimitTime) * 1000;
    this.cardOptions = options.cards ? options.cards : {};
    this.cardsInGame = Card.newSet(this.cardOptions);
    this.players = [];
}

SkullKing.prototype.checkAlive = function () {
    if (this.players.length === 0 || !this.players.find(p => !p.disconnected))
        return false;
    if (this.onGame)
        return true;
    if (moment(this.createdAt).isBefore(new Date().getTime() - 10 * 60 * 1000))
        return true;
    if (moment(this.gameDoneAt).isBefore(new Date().getTime() - 10 * 60 * 1000))
        return true;
    return false;
};

SkullKing.prototype.addPlayer = function (playerKey, user) {
    const player = new Player(playerKey);
    if (this.onGame)
        throw "this room is on game.";
    if (user) {
        player.name = user.name;
        player.userId = user._id;
    }
    if (this.players.length === 0) {
        player.maker = true;
        this.maker = player.getName();
    }
    if (this.players.length + 1 > this.maxSize)
        throw "Too many players.";
    this.players.push(player);
    setTimeout(() => {
        if (player.disconnected)
            this.players.remove(player);
    }, 1000);
};

SkullKing.prototype.doneGame = function () {
    this.onGame = false;
    this.phase = '';
    this.duetime = null;
    this.duration = null;
    this.gameDoneAt = new Date().getTime();
    clearTimeout(this.countEvent);
    const res = this.players
        .sort((p, p2) => {
            return p2.point - p.point;
        });
    this.alert(res
        .map((player, i) => {
            return `${i + 1}. ${player.getName()} : ${player.point}`
        }).join("<br>"), "Game Result");
    const result = new GameResult({
        users: res.map((player, i) => {
            player.rank = (i + 1);
            return {rank: player.rank, name: player.name, userId: player.userId, point: player.point};
        }),
        rounds: this.rounds
    });
    result.save((err, save) => {
        this.players.forEach(p => p.saveResult(this.players.length));
    });
};

SkullKing.prototype.newCardsSet = function () {
    this.cards = _.cloneDeep(this.cardsInGame);
};

SkullKing.prototype.nextRound = function (message) {
    this.round++;
    if (this.round > this.maxRounds) {
        this.doneGame();
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
    this.newCardsSet();
    this.players.forEach(p => {
        p.nextRound(this);
    });
    this.phase = "prediction";
    this.pop(`${this.round} Round Prediction`);
    this.countdown(this.predictLimitTime, () => {
        this.players.filter(p => p.prediction === null).forEach(p => {
            p.predict(this, 0);
        });
    });
};

SkullKing.prototype.countdown = function (ms, cb) {
    this.duetime = new Date().getTime() + ms;
    this.duration = ms;
    clearTimeout(this.countEvent);
    this.countEvent = setTimeout(() => {
        try {
            cb();
            this.update();
        }
        catch (e) {
        }
    }, ms);
};

SkullKing.prototype.destroy = function () {
    clearTimeout(this.countEvent);
};

SkullKing.prototype.predictionDone = function () {
    if (!this.players.find(p => p.prediction === null)) {
        this.phase = "submit";
        this.alert(this.players.map((p, i) => {
            return `${p.getName()} : ${p.prediction} wins prediction.`
        }).join("<br>"), "Prediction results");
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
        throw "Not enough players.";
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
    next.pop("Your Turn.");
    this.countdown(this.submitLimitTime, () => {
        if (next.turn) {
            next.submit(this, next.submitable(this).id);
        }
    });
};

module.exports = SkullKing;