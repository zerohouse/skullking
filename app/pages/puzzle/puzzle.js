(function () {
    //
    // const blue = 'blue';
    // const green = 'green';
    // const yellow = '#969600';
    // const red = 'red';
    // const black = 'black';

    angular.module('app').controller('puzzleCtrl', puzzleCtrl);
    /* @ng-inject */

    /* Controllers */
    function puzzleCtrl($rootScope, $scope, popup, $stateParams, socket, pop, $timeout, $state) {

        const clearWatch = $scope.$watch(function () {
            return $rootScope.user;
        }, function (user) {
            if (!user._id) {
                pop.alert("로그인 해주세요.");
                $state.go('puzzlerooms');
                return;
            }
            socket.emit('join', {type: 'Puzzle', id: user._id});
        });

        const game = $scope.game = {};

        socket.on("game", function (g) {
            $scope.timeAdjust = new Date().getTime() - game.timeAdjust;
            angular.copy(g, $scope.game);
            if (!$scope.game.robots[0].up)
                $scope.game.robots = g.robots.map(r => {
                    const robot = new Robot();
                    angular.copy(r, robot);
                    robot.game = $scope.game;
                    return robot;
                });
            $scope.$apply();
        });

        $scope.move = (robot, index, direction) => {
            if (!$scope.game.proveTurn) {
                pop.alert("증명 순서가 아닙니다.");
                return;
            }
            if (!$scope.game.players.findById($rootScope.user._id).turn) {
                pop.alert("내 차례가 아닙니다.");
                return;
            }
            robot[['up', 'down', 'left', 'right'][direction]]();
            socket.emit('player', 'move', index, direction);
        };

        $scope.short = () => {
            const number = prompt("목적지까지 몇번만에 갈 수 있을까?");
            if (isNaN(number) || (!number && number !== 0)) {
                pop.alert("숫자를 입력해주세요.");
                return;
            }
            socket.emit('player', 'short', number);
        };


        $scope.noShort = () => {
            popup.confirm("현재 기록된 경로가 최단경로입니다.", "더 짧은 경로 없음").then(function () {
                socket.emit('player', 'noShort');
            });
        };

        $scope.$on("$destroy", function () {
            clearWatch();
            socket.removeAllListeners("game");
            socket.removeAllListeners("err");
        });

        var requestAnimationFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (/* function */ callback /* DOMElement */) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        function timeUpdate() {
            if (!game || !game.duetime) {
                $timeout(timeUpdate, 1000);
                return;
            }

            if ($scope.timeAdjust)
                $scope.remain = game.duetime - ((new Date().getTime() - $scope.timeAdjust));
            else
                $scope.remain = game.duetime - (new Date().getTime());

            if (!$scope.$$phase)
                $scope.$apply();
            requestAnimationFrame(timeUpdate);
        }

        timeUpdate();
    }

    function Robot(game, color) {
        if (!game)
            return;
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

    Robot.prototype.up = function () {
        while (this.row > 0 && !this.game.blocks[this.row - 1][this.column].bottom && !this.game.robots.find(r => r.row === this.row - 1 && r.column === this.column)) {
            this.row--;
        }
    };


    Robot.prototype.down = function () {
        while (this.row < this.game.blocks[0].length - 1 && !this.game.blocks[this.row][this.column].bottom && !this.game.robots.find(r => r.row === this.row + 1 && r.column === this.column)) {
            this.row++;
        }
    };

    Robot.prototype.left = function () {
        while (this.column > 0 && !this.game.blocks[this.row][this.column - 1].right && !this.game.robots.find(r => r.row === this.row && r.column === this.column - 1)) {
            this.column--;
        }
    };

    Robot.prototype.right = function () {
        while (this.column < this.game.blocks.length - 1 && !this.game.blocks[this.row][this.column].right && !this.game.robots.find(r => r.row === this.row && r.column === this.column + 1)) {
            this.column++;
        }
    };


})();



