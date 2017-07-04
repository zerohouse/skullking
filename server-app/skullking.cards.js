var type = require('./skullking.type');
var _ = require('lodash');
var types = require('./skullking.constants').types;

function Card(t, number) {
    this.type = _.cloneDeep(t);
    if (this.type.name === type.red.name || this.type.name === type.blue.name || this.type.name === type.black.name || this.type.name === type.yellow.name)
        this.no = number;
    else {
        this.no = 0;
        var typeInfo = types[this.type.name][number];
        if(!typeInfo)
            typeInfo = types[this.type.name].random();
        this.name = typeInfo.name;
        this.src = typeInfo.src;
    }
    this.desc = this.type.desc;
}

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
        for (var i = 0; i < 100; i++) {
            cards.push(new Card(type.pirateOR, i));
        }
        cards.forEach((card, i) => {
            card.id = i;
        });
        return cards;
    }
};