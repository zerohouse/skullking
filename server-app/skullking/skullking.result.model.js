const mongoose = require('../mongoose.connect');

const gameResultSchema = mongoose.Schema({
    users: [],
    rounds: []
});

const SkullKingResult = mongoose.model('SkullKingResult', gameResultSchema);

module.exports = SkullKingResult;