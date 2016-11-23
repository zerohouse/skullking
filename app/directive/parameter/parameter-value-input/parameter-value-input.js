(function () {
    angular.module('app').directive('parameterValueInput', parameterValueInput);
    /* @ng-inject */
    function parameterValueInput() {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                index: '=',
                name: '=?',
                type: '=',
                language: '=?'
            },
            templateUrl: '/directive/parameter/parameter-value-input/parameter-value-input.html',
            controller: function ($scope) {
                $scope.add = function (index, value) {
                    if (!$scope.data[index])
                        $scope.data[index] = [];
                    $scope.data[index].push(value);
                };
            }
        };
    }
})();