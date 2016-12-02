(function () {
    angular.module('app').directive('playerState', playerState);
    /* @ng-inject */
    function playerState() {
        return {
            restrict: 'A',
            templateUrl: '/directives/player-state/player-state.html',
            scope: {
                state: '=',
                game: '='
            }
        };
    }
})();