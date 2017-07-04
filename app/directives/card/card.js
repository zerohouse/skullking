(function () {
    angular.module('app').directive('card', card);
    /* @ng-inject */
    function card() {
        return {
            restrict: 'E',
            scope: {
                card: '='
            },
            templateUrl: '/directives/card/card.html',
            controller: function ($scope, colors) {
                $scope.getColor = function (name) {
                    return colors[name];
                };
                $scope.names = {};
            },
            link: function (s, e) {
                e.css('background-image', `url(${s.card.src})`);
            }
        };
    }
})();