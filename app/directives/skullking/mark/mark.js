(function () {
    angular.module('app').directive('mark', mark);
    /* @ng-inject */
    function mark() {
        return {
            restrict: 'E',
            link: function ($scope, e, a) {
                $(e).css('background-image', `url(/images/marks/${a.mark}.png)`);
            }
        };
    }
})();