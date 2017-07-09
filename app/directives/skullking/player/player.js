(function () {
    angular.module('app').directive('player', player);
    /* @ng-inject */
    function player() {
        return {
            restrict: 'E',
            templateUrl: '/directives/skullking/player/player.html',
            scope: {
                player: '=',
                index: '=',
                game: '='
            },
            controller: function ($scope, $sce) {
                var clear = $scope.$watch('player', function (player) {
                    if (!player || !player.points)
                        return;
                    $scope.log = $sce.trustAsHtml(player.points.map(p => `${p.name} ${p.point > 0 ? "+" : ""}${p.point}`).join("<br>"));
                });
                $scope.$on('$destroy', function () {
                    clear();
                });
            }
        };
    }
})();