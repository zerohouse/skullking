(function () {
    angular.module('app').directive('parameterInput', parameterInput);
    /* @ng-inject */
    function parameterInput() {
        return {
            restrict: 'E',
            scope: {
                parameter: '=',
                readonly: '='
            },
            templateUrl: '/directive/parameter/parameter-input/parameter-input.html'
        };
    }
})();