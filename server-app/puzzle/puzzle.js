const Player = require('./puzzle.player');

function Game(id) {
    this.type = 'puzzle';
    this.id = id;
    this.icons = ['fa-dot-circle-o', 'fa-bolt', 'fa-bomb', 'fa-tree', 'fa-bug', 'fa-bus', 'fa-cloud', 'fa-book', 'fa-car', 'fa-cube', 'fa-flag', 'fa-gavel', 'fa-thumbs-up', 'fa-rocket', 'fa-tint', 'fa-wifi', 'fa-paper-plane'];
    const blocks = this.blocks = [];
    this.spots = [];
    this.players = [];
    this.move = 0;
    this.shorts = [];
    for (let i = 0; i < 16; i++) {
        blocks.push([]);
        for (let j = 0; j < 16; j++) {
            blocks[i].push(new Block(i, j));
        }
    }
}


const blue = 'blue';
const green = 'green';
const yellow = '#969600';
const red = 'red';
const black = 'black';

Game.prototype.start = function () {
    const blocks = this.blocks;
    blocks[0][3].right = true;
    blocks[0][9].right = true;
    blocks[1][5].right = true;
    blocks[1][13].right = true;
    blocks[3][1].right = true;
    blocks[3][8].right = true;
    blocks[4][4].right = true;
    blocks[5][2].right = true;
    blocks[5][7].right = true;
    blocks[6][10].right = true;
    blocks[6][13].right = true;
    blocks[7][6].right = true;
    blocks[7][8].right = true;
    blocks[8][6].right = true;
    blocks[8][8].right = true;
    blocks[9][3].right = true;
    blocks[10][8].right = true;
    blocks[11][4].right = true;
    blocks[11][12].right = true;
    blocks[13][0].right = true;
    blocks[13][8].right = true;
    blocks[14][6].right = true;
    blocks[14][14].right = true;
    blocks[15][4].right = true;
    blocks[15][11].right = true;

    blocks[7][7].prohibit = true;
    blocks[7][8].prohibit = true;
    blocks[8][7].prohibit = true;
    blocks[8][8].prohibit = true;

    blocks[0][13].bottom = true;
    blocks[1][6].bottom = true;
    blocks[2][1].bottom = true;
    blocks[2][9].bottom = true;
    blocks[3][5].bottom = true;
    blocks[4][15].bottom = true;
    blocks[5][2].bottom = true;
    blocks[5][7].bottom = true;
    blocks[6][0].bottom = true;
    blocks[6][7].bottom = true;
    blocks[6][8].bottom = true;
    blocks[6][10].bottom = true;
    blocks[6][14].bottom = true;
    blocks[8][7].bottom = true;
    blocks[8][8].bottom = true;
    blocks[9][3].bottom = true;
    blocks[9][15].bottom = true;
    blocks[10][0].bottom = true;
    blocks[10][5].bottom = true;
    blocks[10][8].bottom = true;
    blocks[10][13].bottom = true;
    blocks[13][1].bottom = true;
    blocks[13][1].bottom = true;
    blocks[13][6].bottom = true;
    blocks[13][9].bottom = true;
    blocks[13][14].bottom = true;

    this.robotReposition();

    this.makeSpot(1, 6, blue);
    this.makeSpot(1, 13, green);
    this.makeSpot(3, 1, yellow);
    this.makeSpot(13, 1, yellow);
    this.makeSpot(5, 2, red);
    this.makeSpot(9, 3, blue);
    this.makeSpot(4, 5, green);
    this.makeSpot(3, 9, red);
    this.makeSpot(6, 10, blue);
    this.makeSpot(6, 14, yellow);
    this.makeSpot(14, 14, red);
    this.makeSpot(11, 13, blue);
    this.makeSpot(10, 8, yellow);
    this.makeSpot(11, 5, red);
    this.makeSpot(14, 6, green);
    this.makeSpot(13, 9, green);
    this.makeSpot(5, 7, black);

    this.nextSpot();

};

Game.prototype.update = function () {
    this.players.forEach(p => p.update());
};

Game.prototype.destroy = function () {

};

Game.prototype.alert = function (message, title) {
    this.players.forEach(p => p.alert(message, title));
};

Game.prototype.addPlayer = function (playerKey, user) {
    const player = new Player(playerKey);
    this.players.push(player);
    return player;
};

Game.prototype.nextSpot = function () {
    this.alert("목적지를 확인하고 최단경로를 선언하세요.");
    this.clearCountDown();
    this.shorts = [];
    const spot = this.spot;
    while (spot === this.spot) {
        this.spot = this.spots.random();
    }
    this.move = 0;
    this.robots.forEach(robot => {
        robot.startRow = robot.row;
        robot.startColumn = robot.column;
    });
};

Game.prototype.clearCountDown = function () {
    clearTimeout(this.countEvent);
    this.duetime = 0;
    this.duration = 0;
};

Game.prototype.countdown = function (ms, cb) {
    this.duetime = new Date().getTime() + ms;
    this.duration = ms;
    clearTimeout(this.countEvent);
    this.countEvent = setTimeout(() => {
        try {
            cb();
            this.update();
        }
        catch (e) {
        }
    }, ms);
};


Game.prototype.makeSpot = function (row, column, color) {
    const block = this.blocks[row][column];
    block.icon = this.icons.pop();
    block.color = color;
    this.spots.push(block);
};

Game.prototype.robotReposition = function () {
    const robots = this.robots = [];
    robots.push(new Robot(this, blue));
    robots.push(new Robot(this, yellow));
    robots.push(new Robot(this, red));
    robots.push(new Robot(this, green));
    robots.push(new Robot(this, black));
};

Game.prototype.reset = function () {
    this.robots.forEach(robot => robot.resetPosition());
    this.move = 0;
};

Game.prototype.moveAfter = function (robot) {
    const success = this.spot && this.spot.row === robot.row
        && this.spot.column === robot.column
        && (this.spot.color === robot.color || this.spot.color === 'black');
    if (success) {
        this.alert(`성공: ${this.move}회 이동`);
        this.move = 0;
        this.nextSpot();
    }
};

Game.prototype.prove = function () {
    this.proveTurn = true;
    this.players.forEach(p => p.giveUp = false);
    const short = this.shorts[0];
    this.shorts = this.shorts.splice(1);
    const player = this.players.findById(short.player);
    player.proveTurn(short);
    this.alert(`${player.name}님의 증명차례입니다.`);
    this.countdown(60000, () => {
        this.proveFail(player, short.number);
    });
};

Game.prototype.proveSuccess = function (player, number) {
    this.proveTurn = false;
    this.alert(`${player.name}님이 ${number} 증명에 성공했습니다.`, "성공");
    player.score++;
    this.nextSpot();
};

Game.prototype.proveFail = function (player, number) {
    this.proveTurn = false;
    this.alert(`${player.name}님이 ${number} 증명에 실패했습니다.`, "실패");
    if (this.shorts.length === 0) {
        this.nextSpot();
    }
    else
        this.prove();
};

let i = 0;

function Robot(game, color) {
    let startBlock;
    this.id = i;
    i++;
    while (!startBlock) {
        const block = game.blocks.random().random();
        if (block.robot || block.prohibit)
            continue;
        startBlock = block;
    }

    this.column = this.startColumn = startBlock.column;
    this.row = this.startRow = startBlock.row;
    startBlock.robot = this;
    this.color = color;
    this.game = game;
}

Robot.prototype.resetPosition = function () {
    this.row = this.startRow;
    this.column = this.startColumn;
};

Robot.prototype.up = function (player) {
    const row = this.row;
    while (this.row > 0 && !this.game.blocks[this.row - 1][this.column].bottom && !this.game.robots.find(r => r.row === this.row - 1 && r.column === this.column)) {
        this.row--;
    }
    if (row === this.row)
        return;
    this.moveAfter(player);
};


Robot.prototype.down = function (player) {
    const row = this.row;
    while (this.row < this.game.blocks[0].length - 1 && !this.game.blocks[this.row][this.column].bottom && !this.game.robots.find(r => r.row === this.row + 1 && r.column === this.column)) {
        this.row++;
    }
    if (row === this.row)
        return;
    this.moveAfter(player);
};

Robot.prototype.left = function (player) {
    const column = this.column;
    while (this.column > 0 && !this.game.blocks[this.row][this.column - 1].right && !this.game.robots.find(r => r.row === this.row && r.column === this.column - 1)) {
        this.column--;
    }
    if (column === this.column)
        return;
    this.moveAfter(player);
};

Robot.prototype.right = function (player) {
    const column = this.column;
    while (this.column < this.game.blocks.length - 1 && !this.game.blocks[this.row][this.column].right && !this.game.robots.find(r => r.row === this.row && r.column === this.column + 1)) {
        this.column++;
    }
    if (column === this.column)
        return;
    this.moveAfter(player);
};

Robot.prototype.moveAfter = function (player) {
    if (this.game.move >= player.number) {
        const success = this.game.spot && this.game.spot.row === this.row
            && this.game.spot.column === this.column
            && (this.game.spot.color === this.color || this.game.spot.color === 'black') && this.game.move === player.number;
        if (success) {
            this.game.proveSuccess(player, this.game.move);
            return;
        }
        this.game.proveFail(player, this.game.move);
        return;
    }
    player.moves.push({id: this.id, row: this.column, column: this.column});
    this.game.move++;
    this.game.moveAfter(this);
};

function Block(row, column) {
    this.row = row;
    this.column = column;
}

module.exports = Game;