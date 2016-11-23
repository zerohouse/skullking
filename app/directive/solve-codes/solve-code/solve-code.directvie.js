(function () {
    angular.module('app').directive('solveCode', solveCode);
    /* @ng-inject */
    function solveCode() {
        return {
            scope: {solveCode: '='},
            restrict: 'E',
            templateUrl: '/directive/solve-codes/solve-code/solve-code.html'
        };
    }
})();