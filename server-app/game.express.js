const games = require('./game.socket').games;
const gameTypes = {
    SkullKing: require('./skullking/skullking.game'),
    Check: require('./checkgame/game')
};
const randomstring = require("randomstring");
const _ = require('lodash');
const User = require('./user/user.model');

module.exports = function (app) {

    app.post('/api/getCode', function (req, res) {
        if (!req.body) {
            res.sendError("Invalid Access.");
            return;
        }

        // 새로운 방 생성시
        if (req.body.new) {
            // if(!req.session.user)
            //     req.session.user = {name:"sdf"};
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
            const options = req.body.options ? req.body.options : {};
            if (!options.name)
                options.name = `${req.session.user.name}'s game.`;
            const room = randomstring.generate();
            if (!gameTypes[req.body.type]) {
                res.sendError("Invalid Access.");
                return;
            }
            const game = new gameTypes[req.body.type](room, options);
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
            return;
        }

        // 기존 방 입장시
        if (req.session.user && games[req.session.user.room]) {
            const player = games[req.session.user.room].players.findBy("userId", req.session.user._id);
            if (player) {
                const key = randomstring.generate();
                player.id = key;
                req.session.key = key;
                req.session.user.room = req.body.id;
                res.send(key);
                return;
            }
        }
        const game = games[req.body.id];
        if (!game) {
            res.sendError("Not exist game.");
            return;
        }
        if (game.password && (game.password !== req.body.password)) {
            res.sendError("Wrong password.");
            return;
        }
        const key = randomstring.generate();
        game.addPlayer(key, req.session.user);
        req.session.key = key;
        if (req.session.user)
            req.session.user.room = req.body.id;
        res.send(key);
    });

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

};
