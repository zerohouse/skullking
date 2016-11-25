(function () {
    angular.module('app').directive('player', player);
    /* @ng-inject */
    function player() {
        return {
            restrict: 'E',
            templateUrl: '/directives/player/player.html',
            scope: {
                player: '=',
                index: '=',
                isMe:'=',
                isVoting:'='
            }
        };
    }
})();