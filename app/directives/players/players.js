(function () {
    angular.module('app').directive('players', players);
    /* @ng-inject */
    function players() {
        return {
            restrict: 'E',
            templateUrl: '/directives/players/players.html',
            scope: {
                players: '=',
                player: '=',
                max: '=',
                isVoting: '=',
                isEnd: '='
            },
            controller: function ($scope, ChatSocket, popup) {
                $scope.voteStart = function () {
                    if (!$scope.allSelect())
                        return;
                    popup.confirm("투표 시작한다.").then(function () {
                        ChatSocket.emit("voteStart");
                    });
                };

                $scope.allSelect = function () {
                    return $scope.players.filter(player=>player.select).length >= $scope.max;
                };

                $scope.select = function (player) {
                    if (!$scope.player || !$scope.player.king)
                        return;
                    if (!player.select && $scope.allSelect())
                        return;
                    player.select = !player.select;
                    ChatSocket.emit('select', $scope.players.filter(player=>player.select).map(player=>$scope.players.indexOf(player)));
                };
            }
        };
    }
})();