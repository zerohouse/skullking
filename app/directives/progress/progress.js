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
                $scope.getStyle = function () {
                    var percent = Math.min(100, $scope.value);
                    var color = percent > 80 ? '#da0000' : '#59ce2c';
                    return {'background-color': color, width: `${percent}%`};
                };
            }
        };
    }
})();