(function () {

    const blue = 'blue';
    const green = 'green';
    const yellow = '#969600';
    const red = 'red';
    const black = 'black';

    angular.module('app').controller('puzzleSingleCtrl', puzzleSingleCtrl);
    /* @ng-inject */

    /* Controllers */
    function puzzleSingleCtrl($scope, popup) {

        const game = $scope.game = new Game();
        game.alert = popup.alert;
        const blocks = game.blocks;

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

        game.robotReposition();

        game.makeSpot(1, 6, blue);
        game.makeSpot(1, 13, green);
        game.makeSpot(3, 1, yellow);
        game.makeSpot(13, 1, yellow);
        game.makeSpot(5, 2, red);
        game.makeSpot(9, 3, blue);
        game.makeSpot(4, 5, green);
        game.makeSpot(3, 9, red);
        game.makeSpot(6, 10, blue);
        game.makeSpot(6, 14, yellow);
        game.makeSpot(14, 14, red);
        game.makeSpot(11, 13, blue);
        game.makeSpot(10, 8, yellow);
        game.makeSpot(11, 5, red);
        game.makeSpot(14, 6, green);
        game.makeSpot(13, 9, green);
        game.makeSpot(5, 7, black);

        $scope.setRobot = robot => $scope.robot = robot;

    }

    function Game() {
        this.icons = ['fa-dot-circle-o', 'fa-bolt', 'fa-bomb', 'fa-tree', 'fa-bug', 'fa-bus', 'fa-cloud', 'fa-book', 'fa-car', 'fa-cube', 'fa-flag', 'fa-gavel', 'fa-thumbs-up', 'fa-rocket', 'fa-tint', 'fa-wifi', 'fa-paper-plane'];
        const blocks = this.blocks = [];
        this.spots = [];
        this.move = 0;
        for (let i = 0; i < 16; i++) {
            blocks.push([]);
            for (let j = 0; j < 16; j++) {
                blocks[i].push(new Block(i, j));
            }
        }
    }

    Game.prototype.nextSpot = function () {
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
        const success = this.spot && this.spot.row === robot.row && this.spot.column === robot.column && (this.spot.color === robot.color || this.spot.color === 'black');
        if (success) {
            this.alert(`성공: ${this.move}회 이동`);
            this.move = 0;
            this.nextSpot();
        }
    };

    function Robot(game, color) {
        let startBlock;
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

    Robot.prototype.up = function () {
        const row = this.row;
        while (this.row > 0 && !this.game.blocks[this.row - 1][this.column].bottom && !this.game.robots.find(r => r.row === this.row - 1 && r.column === this.column)) {
            this.row--;
        }
        if (row === this.row)
            return;
        this.moveAfter();
    };


    Robot.prototype.down = function () {
        const row = this.row;
        while (this.row < this.game.blocks[0].length - 1 && !this.game.blocks[this.row][this.column].bottom && !this.game.robots.find(r => r.row === this.row + 1 && r.column === this.column)) {
            this.row++;
        }
        if (row === this.row)
            return;
        this.moveAfter();
    };

    Robot.prototype.left = function () {
        const column = this.column;
        while (this.column > 0 && !this.game.blocks[this.row][this.column - 1].right && !this.game.robots.find(r => r.row === this.row && r.column === this.column - 1)) {
            this.column--;
        }
        if (column === this.column)
            return;
        this.moveAfter();
    };

    Robot.prototype.right = function () {
        const column = this.column;
        while (this.column < this.game.blocks.length - 1 && !this.game.blocks[this.row][this.column].right && !this.game.robots.find(r => r.row === this.row && r.column === this.column + 1)) {
            this.column++;
        }
        if (column === this.column)
            return;
        this.moveAfter();
    };

    Robot.prototype.moveAfter = function () {
        this.game.move++;
        this.game.moveAfter(this);
    };

    Robot.prototype.style = function () {
        const style = {'background-color': this.color};
        style.left = (this.column * 40) + "px";
        style.top = (this.row * 40) + "px";
        return style;
    };


    Robot.prototype.startStyle = function () {
        const style = {'background-color': this.color};
        style.left = (this.startColumn * 40) + "px";
        style.top = (this.startRow * 40) + "px";
        return style;
    };


    function Block(row, column) {
        this.row = row;
        this.column = column;
    }

    Block.prototype.leftBar = function () {
        this.left = !this.left;
    };

    Block.prototype.rightBar = function () {
        this.right = !this.right;
    };

    Block.prototype.bottomBar = function () {
        this.bottom = !this.bottom;
    };

    Block.prototype.topBar = function () {
        this.top = !this.top;
    };

})();



