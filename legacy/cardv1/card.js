(function () {
    angular.module('app').directive('card', card);
    /* @ng-inject */
    function card() {
        return {
            restrict: 'E',
            scope: {
                card: '='
            },
            templateUrl: '/legacy/cardv1/card.html',
            controller: function ($scope, colors) {
                $scope.getColor = function (name) {
                    return colors[name];
                };
                $scope.names = {};
            }
        };
    }
})();