function Player(key, user) {
    this.id = key;
    // this.game = game;
    this.combo = 1;
    this.lastPoint = 1;
    this.last = new Date();
}

const steam = [{point: 15, booster: 2, timeout: 30000, name: "헉헉"}, {
    point: 30,
    booster: 4,
    timeout: 30000,
    name: "하악하악"
}, {
    point: 150,
    booster: 10,
    timeout: 60000, name: "부와아악"
}];

Player.prototype.send = function (message) {
    if (this.disconnect) {
        return;
    }
    this.socket.emit('chat', message);
};

Player.prototype.steam = function (i) {
    if (this.booster)
        return;
    if (this.score < steam[i].point)
        return;
    this.game.alert(this.name + "님이 " + steam[i].name + "을 사용했습니다.");
    this.socket.emit('checkgame.steamstart', i);
    this.score = this.score - steam[i].point;
    this.booster = steam[i].booster;
    this.game.update();
    const self = this;
    setTimeout(function () {
        self.booster = undefined;
        self.emit('checkgame.steamend', i);
        self.update();
    }, steam[i].timeout);
};


Player.prototype.check = function (selects) {
    if (this.delayCheck())
        return;
    const check = this.game.check(selects);
    if (!check) {
        this.plus(-1);
        this.game.update();
        return;
    }
    this.plus(1);
    this.game.update();
};

Player.prototype.done = function () {
    if (this.delayCheck())
        return;
    const done = this.game.isDone();
    if (!done) {
        this.plus(-3);
        this.game.update();
        return;
    }
    this.plus(3);
    this.game.start();
    this.game.update();
};

Player.prototype.plus = function (point) {
    let type = "합";
    let result = "실패";
    let combo = "";
    if (Math.abs(point) === 3)
        type = "결";
    if (point > 0)
        result = "성공";

    const self = this;
    if (isSame(point) && (new Date().getTime() < this.last.getTime() + 2500)) {
        this.combo++;
        combo = this.combo + "연속 ";
    }
    else
        this.combo = 1;
    point = point * this.combo * this.combo;
    this.score += point;
    this.game.alert(this.name + "님 " + type + " " + result + " " + combo + " " + point);
    this.lastPoint = point;
    this.last = new Date();
    this.save();
    function isSame(point) {
        if (!self.lastPoint)
            return;
        if (point > 0)
            return self.lastPoint > 0;
        return self.lastPoint < 0;
    }
};

Player.prototype.delayCheck = function () {
    if (new Date().getTime() < this.last.getTime() + 500) {
        return true;
    }
};

Player.prototype.getName = function () {
    return this.name;
};

Player.prototype.getInfo = function () {
    const info = {};
    info.score = this.score;
    info.name = this.name;
    info.sid = this.sid;
    info.combo = this.combo;
    info.booster = this.booster;
    return info;
};


Player.prototype.save = function () {
    this.socket.session.user.score = this.score;
    store.set(this.sid, this.socket.session);
    if (!this.socket.session.user.email)
        return;
    db.User.update({email: this.socket.session.user.email}, {score: this.score}, function (er, res) {
    });
};

Player.prototype.alert = function (message, fail, duration) {
    const m = new Message(message, fail, duration);
    this.socket.emit('alert', m);
};

function Message(message, fail, duration) {
    this.message = message;
    this.fail = fail;
    this.duration = duration;
}


module.exports = Player;