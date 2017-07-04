var type = require('./skullking.type');
var Step = require('./skullking.step');

function Round(roundNo, first, playerSize, game) {
    this.roundNo = roundNo;
    this.steps = [];
    this.first = first;
    this.playerSize = playerSize;
    this.startStep(first, playerSize, game);
}

Round.prototype.startStep = function (first, playerSize, game) {
    game.players.forEach(p => p.first = p.turn);
    this.steps.push(new Step(first, playerSize));
};

Round.prototype.submit = function (card, game) {
    var win = this.steps.last().submit(card, game);
    if (!win)
        return;
    var winner = game.players.findById(win.card.player);
    winner.win++;
    if (this.steps.length < this.roundNo) {
        game.alert(`${winner.getName()}님이 ${win.card.name || win.card.type.name + " " + win.card.no} 카드로 승리했습니다.`);
        this.startStep(this.first, this.playerSize, game);
        return;
    }
    this.done(game);
};

Round.prototype.done = function (game) {
    game.nextRound(game.players.map(player => {
        this.calculatePoint(player);
        var p = player.points.last();
        return `${player.getName()} : ${p.name} ${p.point > 0 ? "+" : ""}${p.point}`
    }).join("<br>"));
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