(function () {
    angular.module('app').directive('primeColor', primeColor);
    /* @ng-inject */
    function primeColor() {
        return {
            restrict: 'E',
            scope: {
                color: '='
            },
            templateUrl: '/directives/prime-color/prime.html',
            controller: function ($scope, colors) {
                $scope.getColor = function (name) {
                    return colors[name];
                };
            }
        };
    }
})();