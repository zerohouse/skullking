(function () {
    angular.module('app').directive('problemDetail', problemDetail);
    /* @ng-inject */
    function problemDetail() {
        return {
            restrict: 'E',
            templateUrl: '/directive/problem-detail/problem-detail.html',
            controller: 'problemDetailDirCtrl',
            scope: {
                problem: '=',
                language: '='
            }
        };
    }
})();