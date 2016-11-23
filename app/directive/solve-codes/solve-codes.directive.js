(function () {
    angular.module('app').directive('solveCodes', app);
    /* @ng-inject */
    function app() {
        return {
            restrict: 'E',
            templateUrl: '/directive/solve-codes/solve-codes.html',
            scope: {
                title: '@',
                solveCodes: '=',
                limit: '@?'
            },
            controller: 'solveCodesCtrl'
        };
    }
})();