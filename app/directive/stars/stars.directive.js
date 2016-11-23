(function () {
    angular.module('app').directive('stars', stars);
    /* @ng-inject */
    function stars() {
        return {
            restrict: 'E',
            templateUrl: '/directive/stars/stars.html',
            scope: {
                ngModel: '=',
                max: '@?',
                readonly: '=',
                fill: '@?',
                back: '@?'
            },
            controller: function ($scope) {
                if (!$scope.fill)
                    $scope.fill = '#F1C40F';
                if (!$scope.back)
                    $scope.back = '#BDC3C7';
                if ($scope.max === undefined)
                    $scope.max = 10;
                if ($scope.max < $scope.ngModel)
                    $scope.max = $scope.ngModel;
                var hover = $scope.ngModel;
                var hovering;
                $scope.click = function (value) {
                    if ($scope.readonly)
                        return;
                    $scope.ngModel = value;
                };
                $scope.hover = function (value) {
                    if ($scope.readonly)
                        return;
                    hovering = true;
                    hover = value;
                };
                $scope.out = function () {
                    hovering = false;
                };
                $scope.compute = function (value) {
                    var state = hovering ? hover : $scope.ngModel;
                    if (state >= value)
                        return {color: $scope.fill};
                    return {color: $scope.back};
                };
                $scope.getArray = function () {
                    var size;
                    if ($scope.max >= $scope.ngModel)
                        size = $scope.max;
                    else size = $scope.ngModel;
                    return Math.ceil(size / 2).toArray();
                };
            }
        };
    }
})();