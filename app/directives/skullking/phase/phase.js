(function () {
    angular.module('app').directive('phase', phase);
    /* @ng-inject */
    function phase() {
        return {
            restrict: 'E',
            templateUrl: '/directives/skullking/phase/phase.html',
            scope: {
                game: '='
            },
            controller: function ($scope) {
                $scope.getRounds = function () {
                    if ($scope.game)
                        return $scope.game.maxRounds;
                    return 10;
                };

                $scope.getColor = function (round) {
                    if (round === ($scope.game.round - 1) && $scope.game.rounds[round])
                        return $scope.game.rounds[round].steps.last().prime;
                };
            }
        };
    }
})();