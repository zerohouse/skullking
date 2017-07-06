(function () {
    angular.module('app').controller('gameCtrl', gameCtrl);
    /* @ng-inject */
    /* Controllers */
    function gameCtrl($scope, popup, ChatSocket, $stateParams, $window, pop, $state, $timeout) {
        $scope.names = {
            prediction: "예측하기",
            submit: "카드 제출"
        };

        $scope.game = {};

        $scope.$watch(function () {
            return $stateParams.id;
        }, function (id) {
            if (!id)
                return;
            ChatSocket.emit('join', {id: id, player: $stateParams.player});
        });

        var onGame;
        $scope.chatShow = true;
        $scope.userShow = true;

        ChatSocket.on("game", function (game) {
            $scope.timeAdjust = new Date().getTime() - game.timeAdjust;
            angular.copy(game, $scope.game);
            if (game.onGame !== onGame) {
                onGame = game.onGame;
                $scope.chatShow = $scope.userShow = !game.onGame;
            }
            var start = game.players.indexOf(game.players.find(p => p.first));
            if (start === -1)
                start = 0;
            game.players.forEach((player, i) => {
                player.turnIndex = (i >= start ? i - start : i + (game.players.length - start)) + 1;
            });
            game.me.turnIndex = game.players.findById(game.me.id).turnIndex;

            game.me.cards.forEach(c => c.submitable = submitCheck(c, game, game.me.cards));
            positioning(game);
            timeUpdate();
            $scope.$apply();
        });

        function submitCheck(c, game, cards) {
            if (c.type.item)
                return true;
            var prime = game.rounds.last().steps.last().prime;
            if (prime !== null && prime !== c.type.name && cards.find(c => c.type.name === prime)) {
                return false;
            }
            return true;
        }

        function positioning(game) {
            if (!game)
                return;
            var max = game.me.cards.length;
            game.me.cards.forEach((c, i) => {
                var width = $window.innerWidth;
                if (!width)
                    return;
                var padding = 30;
                var step = (width - 90 - padding) / max;
                step = Math.min(step, 110);
                c.position = {
                    top: 0,
                    left: (width / 2 + (i - max / 2) * step) - 45 + padding / 2 + "px"
                };
            });
        }

        angular.element($window).bind('resize', function () {
            positioning($scope.game);
            $scope.$apply();
        });


        ChatSocket.on("e", function (m) {
            vex.close();
            if (m.type === "stepDone") {
                var scope = $scope.$new();
                scope.messageAlert = m.message;
                scope.cards = m.cards;
                popup.open('stepDone', scope);
                return;
            }
            popup.alert(m);
        });

        ChatSocket.on("err", function (error) {
            vex.close();
            popup.alert(error);
            $state.go('rooms');
            $timeout(function () {
                location.reload();
            }, 1000);
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
            popup.open('name', $scope);
        };

        $scope.reName = function (name) {
            ChatSocket.emit('playerEvent', 'name', name);
            $scope.close();
        };

        $scope.submit = function (card) {
            if (!card.submitable)
                return;
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

        $scope.getTurnPlayer = function () {
            return $scope.game.players.find(p => p.turn);
        };

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
            if (!$scope.game || !$scope.game.duetime)
                return;
            $scope.remain = (new Date().getTime() - $scope.timeAdjust) - $scope.game.duetime + $scope.game.duration;
            $scope.$apply();
            requestAnimationFrame(timeUpdate);
        }

        timeUpdate();

    }
})();