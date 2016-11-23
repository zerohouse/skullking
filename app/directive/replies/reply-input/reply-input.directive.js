(function () {
    angular.module('app').directive('replyInput', replyInput);
    /* @ng-inject */
    function replyInput() {
        return {
            restrict: 'E',
            templateUrl: '/directive/replies/reply-input/reply-input.html',
            scope: {
                reply: '=',
                mode: '@',
                done: '=',
                cancel: '=',
                title:'='
            },
            controller: function ($scope, $rootScope) {
                $scope.user = $rootScope.user;
            }
        };
    }
})();