var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var session = require('express-session');

app.use(session({
    secret: 'xcvlbjxpobjpxsdfbjpodfibjpo',
    resave: false,
    saveUninitialized: true
}));
app.use(require('body-parser').json());
require('./app/app.prototype');
require('./server-app/game.socket').socket(io);
require('./server-app/game.express')(app);
require('./server-app/user/user.controller')(app);
// require('express-tester')(app, "스컬킹 테스트페이지");

app.response.sendError = function (msg) {
    this.send({code: 100, errmsg: msg});
};

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});
