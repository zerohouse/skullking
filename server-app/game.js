function Game() {
    this.users = [];
    this.vote = 1;
    this.round = 0;
}

Game.prototype.reset = function () {
    this.users = [];
    this.vote = 1;
    this.round = 0;
};

Game.prototype.setMissions = function () {
    this.evil = this.getEvilSize();
    if (this.users.length > 4) {
        this.merlin = true;
        this.assasin = true;
    }
    if (this.users.length > 6) {
        this.percival = true;
        this.modred = true;
    }
    if (this.users.length > 9) {
        this.overon = true;
    }
    switch (this.users.length) {
        case 5:
            this.missions = [new Mission(2), new Mission(3), new Mission(2), new Mission(3), new Mission(3)];
            break;
        case 6:
            this.missions = [new Mission(2), new Mission(3), new Mission(4), new Mission(3), new Mission(4)];
            break;
        case 7:
            this.missions = [new Mission(2), new Mission(3), new Mission(3), new Mission(4, true), new Mission(4)];
            break;
        case 8:
            this.missions = [new Mission(3), new Mission(4), new Mission(4), new Mission(5, true), new Mission(5)];
            break;
        case 9:
            this.missions = [new Mission(3), new Mission(4), new Mission(4), new Mission(5, true), new Mission(5)];
            break;
        case 10:
            this.missions = [new Mission(3), new Mission(4), new Mission(4), new Mission(5, true), new Mission(5)];
            break;
        default:
            this.missions = [];
    }
    function Mission(size, twoFailRequired) {
        this.size = size;
        this.twoFailRequired = twoFailRequired;
    }
};

Game.prototype.start = function () {
    if (this.users.length < 5 || this.users.length > 10)
        return;
    this.playing = true;
    this.userReset();
    var king = this.users.random();
    king.king = true;
    this.king = this.users.indexOf(king);
    var chars = [];
    if (this.merlin)
        chars.push('merlin');
    if (this.percival)
        chars.push('percival');
    if (this.morgana)
        chars.push('morgana');
    if (this.modred)
        chars.push('modred');
    if (this.assasin)
        chars.push('assasin');
    if (this.overon)
        chars.push('overon');
    var evilSize = this.getEvilSize();
    for (var i = this.getEvilCount(); i < evilSize; i++) {
        chars.push("evil");
    }
    for (i = chars.length; i < this.users.length; i++) {
        chars.push("");
    }
    this.users.forEach(user=> {
        var state = chars.random();
        user.state = state;
        chars.remove(state);
    });
};

Game.prototype.userReset = function () {
    this.users.forEach(p=> {
        p.king = false;
        p.select = false
    });
};

Game.prototype.maxSelect = function () {
    return this.missions[this.round].size;
};

Game.prototype.getEvilSize = function () {
    switch (this.users.length) {
        case 5:
            return 2;
        case 6:
            return 2;
        case 7:
            return 3;
        case 8:
            return 3;
        case 9:
            return 3;
        case 10:
            return 4;
    }
    return 0;
};

Game.prototype.getEvilCount = function () {
    var size = 0;
    if (this.morgana)
        size++;
    if (this.assasin)
        size++;
    if (this.modred)
        size++;
    if (this.overon)
        size++;
    return size;
};

Game.prototype.nextKing = function () {
    this.king++;
    if (this.king >= this.users.length)
        this.king = 0;
    this.users.forEach(user=> {
        user.king = false;
    });
    this.users[this.king].king = true;
    this.vote++;
};

Game.prototype.assasinate = function () {
    this.users.forEach(user=> {
        user.king = false;
    });
    this.users.find(user=>user.state === 'assasin').king = true;
};

Game.prototype.endMission = function () {
    var successes = this.users.filter(u=>u.select && u.mission).length;
    var fails = this.users.filter(u=>u.select && !u.mission).length;
    var success = fails == 0;
    if (this.missions[this.round].twoFailRequired) {
        success = fails < 2;
    }
    this.missions[this.round].result = success ? 'success' : 'fail';
    this.round++;
    this.missioning = false;
    this.vote = 0;

    return {successes: successes, fails: fails, success: success};
};


Game.prototype.voteStart = function (user) {
    if (this.users.filter(p=>p.select).length !== this.maxSelect())
        return;
    this.voting = true;
    user.king = false;
    this.king = this.users.indexOf(user);
    this.users.forEach(u=> {
        u.vote = null;
    });
};

Game.prototype.getDisconnected = function () {
    return this.users.find(p=>p.disconnected);
};

Game.prototype.endVote = function () {
    this.voting = false;
    var agree = this.users.filter(u=>u.vote).length;
    var disagree = this.users.filter(u=>!u.vote).length;
    if (agree > disagree) {
        this.missioning = true;
        this.users.forEach(u=> {
            u.mission = null;
        });
    }
    return {agree: agree, disagree: disagree};
};

module.exports = Game;