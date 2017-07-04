(function () {
    angular.module('app').directive('progressbar', progress);
    /* @ng-inject */
    function progress() {
        return {
            restrict: 'E',
            scope: {
                value: '='
            },
            templateUrl: '/directives/progress/progress.html',
            controller: function ($scope) {
                $scope.max = function (value) {
                    return Math.min(100, value);
                };
            }
        };
    }
})();