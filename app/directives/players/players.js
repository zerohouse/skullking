(function () {
    angular.module('app').directive('players', players);
    /* @ng-inject */
    function players() {
        return {
            restrict: 'E',
            templateUrl: '/directives/players/players.html',
            scope: {
                players: '=',
                player: '='
            },
            controller: function ($scope, ChatSocket) {
                $scope.select = function (player) {
                    if (!$scope.player || !$scope.player.king)
                        return;
                    player.select = !player.select;
                    ChatSocket.emit('select', $scope.players.filter(player=>player.select).map(player=>$scope.players.indexOf(player)));
                };
            }
        };
    }
})();