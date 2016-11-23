(function () {
    angular.module('app').directive('problemCard', problemCard);
    /* @ng-inject */
    function problemCard() {
        return {
            restrict: 'E',
            templateUrl: '/directive/problem-card-list/problem-card/problem-card.html',
            scope: {
                problem: '='
            }
        };
    }
})();