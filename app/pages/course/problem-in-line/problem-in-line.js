(function () {
    angular.module('app').directive('problemInLine', problemInLine);
    /* @ng-inject */
    function problemInLine() {
        return {
            restrict: 'E',
            templateUrl: '/pages/course/problem-in-line/problem-in-line.html',
            scope: {
                problem: '='
            }
        };
    }
})();