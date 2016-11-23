(function () {
    angular.module('app').directive('replies', replies);
    /* @ng-inject */
    function replies() {
        return {
            scope: {
                title: '@?',
                type: '@',
                repliesId: '='
            },
            restrict: 'E',
            templateUrl: '/directive/replies/replies.html',
            controller: 'repliesCtrl'
        };
    }
})();