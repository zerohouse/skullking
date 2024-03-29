(function () {
    angular.module('app').controller('skullkingCtrl', skullkingCtrl);
    /* @ng-inject */

    /* Controllers */
    function skullkingCtrl($scope, popup, socket, $stateParams, $window, pop, $state, $timeout) {
        $scope.names = {
            prediction: "Prediction",
            submit: "Submit a Card"
        };

        var game = $scope.game = {};

        var clearWatch = $scope.$watch(function () {
            return $stateParams.id;
        }, function (id) {
            if (!id)
                return;
            socket.emit('join', {type: 'SkullKing', id: id, player: $stateParams.player});
        });


        var onGame;
        $scope.chatShow = false;
        $scope.userShow = true;

        timeUpdate();

        socket.on("game", function (g) {
            $scope.timeAdjust = new Date().getTime() - game.timeAdjust;
            angular.copy(g, $scope.game);
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

            var stepCards;
            if (!game.rounds || game.rounds.length === 0 || game.rounds.last().steps.length === 0) ;
            else
                stepCards = game.rounds.last().steps.last().cards;
            game.me.cards.forEach(c => {
                c.submitable = submitCheck(c, game, game.me.cards);
                if (!stepCards)
                    return;
                c.winable = getWinCard(stepCards.concat(c), game.prime) === c;
            });
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

        function getWinCard(cards, prime) {
            const king = cards.find(c => c.type.king);
            const girl = cards.find(c => c.type.girl);
            const pirate = cards.find(c => c.type.pirate);
            if (king) {
                if (girl)
                    return girl;
                return king;
            }
            if (pirate)
                return pirate;
            if (girl)
                return girl;
            let winCard = null;
            cards.forEach(c => {
                if (!winCard) {
                    winCard = c;
                    return;
                }
                if (c.type.black) {
                    if (!winCard.type.black) {
                        winCard = c;
                        return;
                    }
                    if (winCard.no < c.no) {
                        winCard = c;
                        return;
                    }
                }
                if ((c.type.name === prime) && winCard.no < c.no)
                    winCard = c;
            });
            return winCard;
        }

        socket.on("e", function (m) {
            popup.close();
            if (m.type === "stepDone") {
                var scope = $scope.$new();
                scope.messageAlert = m.message;
                scope.cards = m.cards;
                popup.open('stepDone', scope);
                return;
            }
            popup.alert(m);
        });


        $scope.startGame = function () {
            socket.emit('game', 'start');
        };

        $scope.submit = function (card) {
            if (!card.submitable) {
                pop.error("You must submit prime color card first.");
                return;
            }
            if (!$scope.game.me.turn)
                return;
            if (card.type.name === 'pirateOR') {
                popup.confirm("You can choose use this card as Pirate or Escape.", "Please make choice.", "Pirate", "Escape").then(function () {
                    socket.emit('player', 'submit', card.id, true);
                }, function () {
                    socket.emit('player', 'submit', card.id, false);
                });
                return;
            }
            socket.emit('player', 'submit', card.id);
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
            if (!game || !game.duetime) {
                $timeout(timeUpdate, 1000);
                return;
            }

            if ($scope.timeAdjust)
                $scope.remain = (new Date().getTime() - $scope.timeAdjust) - game.duetime + game.duration;
            else
                $scope.remain = new Date().getTime() - game.duetime + game.duration;

            if (!$scope.$$phase)
                $scope.$apply();
            requestAnimationFrame(timeUpdate);
        }

        timeUpdate();

        $scope.$on("$destroy", function () {
            clearWatch();
            socket.removeAllListeners("game");
            socket.removeAllListeners("err");
            angular.element($window).off('resize');
        });

    }
})();