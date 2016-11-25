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
                isMe: '=',
                isVoting: '='
            },
            controller: function ($scope) {
                $scope.images = [
                    '/images/0.jpg',
                    '/images/1.jpg',
                    '/images/2.jpg',
                    '/images/3.jpg',
                    '/images/4.jpg',
                    '/images/5.png',
                    '/images/6.jpg',
                    '/images/7.jpg',
                    '/images/8.png',
                    '/images/9.png',
                ];
            }
        };
    }
})();