(function () {
    angular.module('app').directive('submitCard', submitCard);
    /* @ng-inject */
    function submitCard() {
        return {
            restrict: 'E',
            scope: {
                card: '=',
                player: '=',
                game: '='
            },
            templateUrl: '/directives/submit-card/submit-card.html'
        };
    }
})();