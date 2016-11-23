(function () {
    angular.module('app').directive('resultOneLine', resultOneLine);
    /* @ng-inject */
    function resultOneLine() {
        return {
            restrict: 'E',
            templateUrl: '/directive/solve-codes/solve-code/result-one-line/result-one-line.html',
            scope: {
                solveCode: '='
            }
        };
    }
})();