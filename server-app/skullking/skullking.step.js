const type = require('./skullking.type.js');

function Step(first, playerSize) {
    this.first = first;
    this.prime = null;
    this.cards = [];
    this.playerSize = playerSize;
    this.win = null;
}

Step.prototype.setPrime = function (card) {
    if (card.type.name === type.red.name || card.type.name === type.yellow.name || card.type.name === type.black.name || card.type.name === type.blue.name)
        this.prime = card.type.name;
};

Step.prototype.submit = function (card, game) {
    this.cards.push(card);
    if (this.prime === null)
        this.setPrime(card);
    if (this.playerSize > this.cards.length) {
        game.nextTurn();
        this.calculateWin();
        return false;
    }
    this.win = this.calculateWin();
    game.players.forEach(p => {
        p.turn = false;
        p.submitCard = null;
    });
    game.players.findById(this.win.card.player).turn = true;
    return this.win;
};

Step.prototype.calculateWin = function () {
    this.cards.forEach(c => c.win = false);
    const winInfo = this.winInfo();
    winInfo.card.win = true;
    return winInfo;
};

Step.prototype.winInfo = function () {
    const king = this.cards.find(c => c.type.king);
    const girl = this.cards.find(c => c.type.girl);
    const pirate = this.cards.find(c => c.type.pirate);
    if (king) {
        if (girl)
            return {card: girl, bonus: 50, name: "해적왕을 홀려 "};
        const pirateLength = this.cards.filter(c => c.type.pirate).length;
        return {card: king, bonus: pirateLength * 30, name: `해적왕으로 해적 ${pirateLength}명 잡아 `};
    }
    if (pirate)
        return {card: pirate};
    if (girl)
        return {card: girl};
    let winCard = null;
    this.cards.forEach(c => {
        if (!winCard) {
            winCard = c;
            return;
        }
        if (winCard.black) {
            if (!c.black) {
                return;
            }
            if (winCard.no < c.no) {
                winCard = c;
                return;
            }
        }
        if ((c.type.name === this.prime) && winCard.no < c.no)
            winCard = c;
    });
    return {card: winCard};
};

module.exports = Step;