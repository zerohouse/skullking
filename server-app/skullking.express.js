const games = require('./skullking').games;
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
            res.sendError("로그인 안됨");
            return;
        }
        keyRoom(req, res);
    });

    function keyRoom(req, res) {
        if (games[req.session.room] && req.session.key && games[req.session.room].players.findById(req.session.key)) {
            if (!games[req.session.room].players.findById(req.session.key).disconnected) {
                res.sendError("이미 접속중입니다.");
                return;
            }
            res.send(req.session.key);
            return;
        }

        const game = games[req.query.id];
        if (!game) {
            res.sendError("없는 방");
            return;
        }
        if (game.password && (game.password !== req.query.password)) {
            res.sendError("패스워드가 다릅니다.");
            return;
        }
        const key = randomstring.generate();
        game.addPlayer(key, req.session.user);
        req.session.key = key;
        req.session.room = req.query.id;
        res.send(key);
    }

    app.get('/api/rooms', function (req, res) {
        res.send(_.map(games, function (v, k) {
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
        }));
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
            res.sendError("로그인 안됨");
            return;
        }
        if (games[req.session.room] && games[req.session.room].players.findById(req.session.key)) {
            if (!games[req.session.room].players.findById(req.session.key).disconnected) {
                res.sendError("이미 접속중입니다.");
                return;
            }
            res.send({
                player: req.session.room,
                room: req.session.key
            });
            return;
        }
        const options = req.body ? req.body : {};
        if (!options.name)
            options.name = `${req.session.user.name}님의 방`;
        const room = randomstring.generate();
        const game = new SkullKing(room, options);
        games[room] = game;
        const playerKey = randomstring.generate();
        game.maker = req.session.user.name;
        game.addPlayer(playerKey, req.session.user);
        req.session.key = playerKey;
        req.session.room = room;
        res.send({
            player: playerKey,
            room: room
        });
    });
};
