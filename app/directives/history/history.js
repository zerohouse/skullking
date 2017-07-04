(function () {
    angular.module('app').directive('history', his);
    /* @ng-inject */
    function his() {
        return {
            restrict: 'E',
            scope: {
                game: '='
            },
            templateUrl: '/directives/history/history.html',
            controller: function ($scope) {

                $scope.getPlayer = function (player) {
                    if(!player || !$scope.game)
                        return;
                    return $scope.game.players.findById(player);
                };

            }
        };
    }
})();