(function () {
    angular.module('app').directive('mission', mission);
    /* @ng-inject */
    function mission() {
        return {
            restrict: 'E',
            templateUrl: '/directives/mission/mission.html',
            scope: {
                mission: '='
            }
        };
    }
})();