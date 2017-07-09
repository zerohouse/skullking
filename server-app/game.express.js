const games = require('./game.socket').games;
const SkullKing = require('./skullking/skullking.game');
const randomstring = require("randomstring");
const _ = require('lodash');
const User = require('./user/user.model');

module.exports = function (app) {
    app.get('/api/playerCode', function (req, res) {
        keyRoom(req, res);
    });

    app.get('/api/userPlayerCode', function (req, res) {
        if (!req.session.user) {
            res.sendError("Not logged");
            return;
        }
        if (games[req.session.user.room]) {
            const player = games[req.session.user.room].players.findBy("userId", req.session.user._id);
            if (player) {
                const key = randomstring.generate();
                player.id = key;
                req.session.key = key;
                req.session.user.room = req.query.id;
                res.send(key);
                return;
            }
        }
        keyRoom(req, res);
    });

    function keyRoom(req, res) {
        const game = games[req.query.id];
        if (!game) {
            res.sendError("Not exist game.");
            return;
        }
        if (game.password && (game.password !== req.query.password)) {
            res.sendError("Wrong password.");
            return;
        }
        const key = randomstring.generate();
        game.addPlayer(key, req.session.user);
        req.session.key = key;
        if (req.session.user)
            req.session.user.room = req.query.id;
        res.send(key);
    }

    app.get('/api/rooms', function (req, res) {
        res.send(_.map(games, function (v, k) {
            if (v.onGame)
                return;
            return {
                id: k,
                name: v.name,
                size: v.players.length,
                maxSize: v.maxSize,
                createdAt: v.createdAt,
                onGame: v.onGame,
                password: v.password !== null,
                maker: v.maker
            };
        }).filter(r => r));
    });

    app.get('/api/ranks', function (req, res) {
        User.find(null,
            ['point', 'ranks', 'name'],
            {
                skip: 0,
                limit: 30,
                sort: {
                    point: -1
                }
            },
            function (err, rankers) {
                res.send(rankers);
            });
    });

    app.post('/api/newRoomCode', function (req, res) {
        if (!req.session.user) {
            res.sendError("Not logged.");
            return;
        }
        if (games[req.session.user.room] && games[req.session.user.room].players.findById(req.session.key)) {
            res.send({
                player: req.session.user.room,
                room: req.session.key
            });
            return;
        }
        const options = req.body ? req.body : {};
        if (!options.name)
            options.name = `${req.session.user.name}'s game.`;
        const room = randomstring.generate();
        const game = new SkullKing(room, options);
        games[room] = game;
        const playerKey = randomstring.generate();
        game.maker = req.session.user.name;
        game.addPlayer(playerKey, req.session.user);
        req.session.key = playerKey;
        req.session.user.room = room;
        res.send({
            player: playerKey,
            room: room
        });
    });
};