(function () {
    angular.module('app').directive('parameterTypesSelect', parameterTypesSelect);
    /* @ng-inject */
    function parameterTypesSelect() {
        return {
            restrict: 'E',
            templateUrl: '/directive/parameter/parameter-types-select/parameter-types-select.html',
            scope: {type: '=', classes: '@', readonly: '='},
            controller: function ($scope, types) {
                $scope.parameterTypes = types.parameters;
                $scope.select = type => {
                    $scope.type = type;
                };
            }
        };
    }
})();