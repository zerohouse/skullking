const games = require('./skullking').games;
const SkullKing = require('./skullking/skullking.game');
const randomstring = require("randomstring");

module.exports = function (app) {
    app.get('/api/playerCode', function (req, res) {
        keyRoom(req, res);
    });

    app.get('/api/userPlayerCode', function (req, res) {
        if (!req.session.user) {
            res.sendError("로그인 안됨");
            return;
        }
        keyRoom(req, res);
    });

    function keyRoom(req, res) {
        if (games[req.session.room] && games[req.session.room].players.findById(req.session.key) && req.session.key) {
            res.send(req.session.key);
            return;
        }
        const game = games[req.query.id];
        if (!game) {
            res.sendError("없는 방");
            return;
        }
        const key = randomstring.generate();
        game.addPlayer(key, req.session.user);
        req.session.key = key;
        req.session.room = req.query.id;
        res.send(key);
    }


    app.get('/api/newRoomCode', function (req, res) {
        if (!req.session.user) {
            res.sendError("로그인 안됨");
            return;
        }
        const room = randomstring.generate();
        const game = new SkullKing(room);
        games[room] = game;
        const playerKey = randomstring.generate();
        game.addPlayer(playerKey, req.session.user);
        req.session.key = playerKey;
        res.send({
            player: playerKey,
            room: room
        });
    });
};

function ecb(cb) {
    return function (err, value) {
        if (err) {
            cb(err);
            return;
        }
        cb(value);
    }
}