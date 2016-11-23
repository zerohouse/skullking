(function () {
    angular.module('app').directive('parameterDisplay', parameterDisplay);
    /* @ng-inject */
    function parameterDisplay() {
        return {
            restrict: 'E',
            scope: {
                parameter: '=value',
                name: '=',
                type: '=',
                language: '=?'
            },
            templateUrl: '/directive/parameter/parameter-display/parameter-display.html'
        };
    }
})();