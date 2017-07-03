var type = require('./skullking.type');

function Round(first, playerSize) {
    this.first = first;
    this.prime = null;
    this.cards = [];
    this.playerSize = playerSize;
}

Round.prototype.setPrime = function (card) {
    if (card.type.name === type.red.name || card.type.name === type.yellow.name || card.type.name === type.black.name || card.type.name === type.blue.name)
        this.prime = card.type.name;
};

Round.prototype.submit = function (card) {
    this.cards.push(card);
    if (this.prime === null)
        this.setPrime(card);
    if (this.playerSize > this.cards.length)
        return false;
    this.win = this.calculateWin();
    return this.win;
};

Round.prototype.calculateWin = function () {
    var king = this.cards.find(c => c.type.king);
    var girl = this.cards.find(c => c.type.girl);
    var soldier = this.cards.find(c => c.type.soldier);
    if (king) {
        if (girl)
            return {card: girl, bonus: 50};
        return {card: king, bonus: this.cards.filter(c => c.type.soldier).length * 30};
    }
    if (soldier)
        return {card: soldier};
    if (girl)
        return {card: girl};
    var winCard;
    this.cards.forEach(c => {
        if (!winCard) {
            winCard = c;
            return;
        }
        if (c.black && winCard.no < c.no) {
            winCard = c;
            return;
        }
        if (c.type.name === this.prime && winCard.no < c.no)
            winCard = c;
    });
    return {card: winCard};
};

module.exports = Round;