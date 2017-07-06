const type = require('./skullking.type.js');
const _ = require('lodash');
const types = require('./skullking.constants.js').types;

function Card(t, number) {
    this.type = _.cloneDeep(t);
    if (this.type.name === type.red.name || this.type.name === type.blue.name || this.type.name === type.black.name || this.type.name === type.yellow.name)
        this.no = number;
    else {
        this.no = 0;
        let typeInfo = types[this.type.name][number];
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
    const prime = game.rounds.last().steps.last().prime;
    return !(prime !== null && prime !== this.type.name && cards.find(c => c.type.name === prime));
};

module.exports = {
    newSet: function (options) {
        let i;
        const cards = [];
        _.forEach(options, (v, k) => {
            if (isNaN(v)) {
                options[k] = undefined;
            }
            options[k] = parseInt(v);
            if (options[k] < 0 || options[k] > 100)
                options[k] = undefined;
        });

        options.numbers = options.numbers ? options.numbers : 13;
        options.pirate = options.pirate ? options.pirate : 5;
        options.white = options.white ? options.white : 5;
        options.girl = options.girl ? options.girl : 2;
        options.pirateOR = options.king ? options.king : 1;
        options.king = options.pirateOR ? options.pirateOR : 1;

        for (i = 1; i <= options.numbers; i++) {
            cards.push(new Card(type.red, i));
            cards.push(new Card(type.blue, i));
            cards.push(new Card(type.yellow, i));
            cards.push(new Card(type.black, i));
        }
        for (i = 0; i < options.pirate; i++) {
            cards.push(new Card(type.pirate, i));
        }
        for (i = 0; i < options.white; i++) {
            cards.push(new Card(type.white, i));
        }
        for (i = 0; i < options.girl; i++) {
            cards.push(new Card(type.girl, i));
        }
        for (i = 0; i < options.king; i++) {
            cards.push(new Card(type.king, i));
        }
        for (i = 0; i < options.pirateOR; i++) {
            cards.push(new Card(type.pirateOR, i));
        }
        cards.forEach((card, i) => {
            card.id = i;
        });
        if (cards.length === 0)
            return module.exports.newSet({});
        return cards;
    }
};