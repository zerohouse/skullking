(function () {
    angular.module('app').controller('gameCtrl', gameCtrl);
    /* @ng-inject */
    /* Controllers */
    function gameCtrl($scope, popup, ChatSocket, $stateParams, $window, pop) {

        $scope.names = {
            prediction: "예측하기",
            submit: "카드 제출"
        };

        $scope.$watch(function () {
            return $stateParams.id;
        }, function (id) {
            if (!id)
                return;
            ChatSocket.emit('join', {id: id, player: $stateParams.player});
        });

        ChatSocket.on("game", function (game) {
            $scope.game = game;
            var start = game.players.indexOf(game.players.find(p => p.first));
            if (start === -1)
                start = 0;
            game.players.forEach((player, i) => {
                player.turnIndex = (i >= start ? i - start : i + (game.players.length - start)) + 1;
            });
            game.me.turnIndex = game.players.findById(game.me.id).turnIndex;
            $scope.$apply();
        });

        ChatSocket.on("e", function (error) {
            popup.alert(error);
        });


        ChatSocket.on("p", function (error) {
            pop.alert(error);
        });


        $scope.startGame = function () {
            ChatSocket.emit('event', 'startGame');
        };

        $scope.name = function (player) {
            if ($scope.game.me.id !== player.id)
                return;
            $scope.n = $scope.game.me.name;
            popup.open('name', "vex-theme-plain", $scope);
        };

        $scope.reName = function (name) {
            ChatSocket.emit('playerEvent', 'name', name);
            $scope.close();
        };

        $scope.submit = function (card) {
            if (!$scope.game.me.turn)
                return;
            if (card.type.name === 'pirateOR') {
                popup.confirm("취소시 도망으로 사용한다.", "카드를 해적으로 사용한다.").then(function () {
                    ChatSocket.emit('playerEvent', 'submit', card.id, true);
                }, function () {
                    ChatSocket.emit('playerEvent', 'submit', card.id, false);
                });
                return;
            }
            ChatSocket.emit('playerEvent', 'submit', card.id);
        };

        angular.element($window).bind('resize', function () {
            $scope.width = $window.innerWidth;
            $scope.$apply();
        });

        $scope.getTurnPlayer = function () {
            return $scope.game.players.find(p => p.turn);
        };

        $scope.getPosition = function (index, max) {
            var width = $window.innerWidth;
            if (!width)
                return;
            var padding = 30;
            var step = (width - 90 - padding) / max;
            step = Math.min(step, 110);
            // var yStep = 30 / max;
            return {
                left: (width / 2 + (index - max / 2) * step) - 45 + padding / 2 + "px"
            };
        };


    }
})();