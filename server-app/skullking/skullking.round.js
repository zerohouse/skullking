var type = require('./skullking.type.js');
var Step = require('./skullking.step.js');

function Round(roundNo, first, playerSize, game) {
    this.roundNo = roundNo;
    this.steps = [];
    this.first = first;
    this.playerSize = playerSize;
    this.resetStep(first, playerSize, game);
}

Round.prototype.resetStep = function (first, playerSize, game) {
    game.players.forEach(p => p.first = p.turn);
    this.steps.push(new Step(first, playerSize));
};

Round.prototype.startStep = function (first, playerSize, game) {
    this.resetStep(first, playerSize, game);
    var first = game.players.find(p => p.first = p.turn);
    game.countdown(game.submitLimitTime, () => {
        if (first.turn) {
            first.submit(game, first.submitable(game).id);
        }
    });
};

Round.prototype.submit = function (card, game) {
    var win = this.steps.last().submit(card, game);
    if (!win)
        return;
    var winner = game.players.findById(win.card.player);
    winner.win++;
    if (this.steps.length < this.roundNo) {
        game.alert({
            message: `<h3>${this.roundNo}라운드 ${this.steps.length}번째 결과</h3>${winner.getName()} 승리 : ${win.card.name || win.card.type.name + " " + win.card.no} 카드`,
            type: 'stepDone',
            cards: this.steps.last().cards
        });
        this.startStep(this.first, this.playerSize, game);
        return;
    }
    game.nextRound({
        message: `<h3>${game.round} 라운드 결과</h3>` + game.players.map(player => {
            this.calculatePoint(player);
            const p = player.points.last();
            return `${player.getName()} : ${p.name} ${p.point > 0 ? "+" : ""}${p.point}`
        }).join("<br>") + `<h3>${this.roundNo}라운드 마지막 결과</h3>${winner.getName()} 승리 : ${win.card.name || win.card.type.name + " " + win.card.no} 카드`,
        type: 'stepDone',
        cards: this.steps.last().cards
    });
};


Round.prototype.calculatePoint = function (player) {
    if (player.prediction === player.win) {
        if (player.prediction === 0) {
            player.addPoint(`${this.roundNo} 라운드 0승 성공`, this.roundNo * 10);
            return;
        }
        player.addPoint(`${this.roundNo} 라운드 ${player.prediction}승 성공`, player.prediction * 20);
        this.steps.forEach((s, i) => {
            if (s.win.card.player !== player.id)
                return;
            if (!s.win.bonus)
                return;
            player.addPoint(`${this.roundNo} 라운드 ${ i + 1 }번째 카드내기 ${s.win.name} 보너스 포인트 획득`, s.win.bonus);
        });
        return;
    }
    if (player.prediction === 0) {
        player.addPoint(`${this.roundNo} 라운드 0승 실패`, -this.roundNo * 10);
        return;
    }
    player.addPoint(`${this.roundNo} 라운드 ${player.prediction}승 실패`, Math.abs(player.prediction - player.win) * -10);
};

module.exports = Round;