(function () {
    angular.module('app').directive('loading', loading);
    /* @ng-inject */
    function loading() {
        return {
            restrict: 'E',
            templateUrl: '/directive/loading/loading.html',
            scope: {message: '@?'}
        };
    }
})();