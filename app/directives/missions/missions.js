(function () {
    angular.module('app').directive('missions', missions);
    /* @ng-inject */
    function missions() {
        return {
            restrict: 'E',
            templateUrl: '/directives/missions/missions.html',
            scope:{
                missions:'='
            }
        };
    }
})();