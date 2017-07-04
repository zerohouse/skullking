(function () {
    angular.module('app').directive('phase', phase);
    /* @ng-inject */
    function phase() {
        return {
            restrict: 'E',
            templateUrl: '/directives/phase/phase.html',
            scope: {
                game: '='
            },
            controller: function ($scope) {
                $scope.getRounds = function () {
                    if ($scope.game)
                        return $scope.game.maxRounds;
                    return 10;
                };
            }
        };
    }
})();