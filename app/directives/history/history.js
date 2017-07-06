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

                $scope.getPredictions = function (index) {
                    return $scope.game.players.map(p => {
                        var predict = p.predictions[index];
                        if (predict !== undefined)
                            predict += "승";
                        else
                            predict = "예측하는 중";
                        return `${p.name}: ${predict}`;
                    }).join(", ");
                };

                $scope.getPlayer = function (player) {
                    if (!player || !$scope.game)
                        return;
                    return $scope.game.players.findById(player);
                };

            }
        };
    }
})();