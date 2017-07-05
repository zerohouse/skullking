var type = require('./skullking.type.js');
var _ = require('lodash');
var types = require('./skullking.constants.js').types;

function Card(t, number) {
    this.type = _.cloneDeep(t);
    if (this.type.name === type.red.name || this.type.name === type.blue.name || this.type.name === type.black.name || this.type.name === type.yellow.name)
        this.no = number;
    else {
        this.no = 0;
        var typeInfo = types[this.type.name][number];
        if (!typeInfo)
            typeInfo = types[this.type.name].random();
        this.name = typeInfo.name;
        this.src = typeInfo.src;
    }
    this.desc = this.type.desc;
}

Card.prototype.submitCheck = function (game, cards) {
    if (this.type.item)
        return true;
    var prime = game.rounds.last().steps.last().prime;
    if (prime !== null && prime !== this.type.name && cards.find(c => c.type.name === prime)) {
        return false;
    }
    return true;
};

module.exports = {
    newSet: function () {
        var cards = [];
        for (var i = 1; i <= 13; i++) {
            cards.push(new Card(type.red, i));
            cards.push(new Card(type.blue, i));
            cards.push(new Card(type.yellow, i));
            cards.push(new Card(type.black, i));
        }

        for (var i = 0; i < 5; i++) {
            cards.push(new Card(type.pirate, i));
            cards.push(new Card(type.white, i));
        }

        for (var i = 0; i < 2; i++) {
            cards.push(new Card(type.girl, i));
        }
        for (var i = 0; i < 1; i++) {
            cards.push(new Card(type.king, i));
        }
        for (var i = 0; i < 1; i++) {
            cards.push(new Card(type.pirateOR, i));
        }
        cards.forEach((card, i) => {
            card.id = i;
        });
        return cards;
    }
};