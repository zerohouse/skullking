(function () {
    angular.module('app').directive('nameAndLevel', nameAndLevel);
    /* @ng-inject */
    function nameAndLevel() {
        return {
            restrict: 'E',
            templateUrl: '/directive/name-and-level/name-and-level.html',
            scope: {
                user: "="
            }, controller: function ($scope, levelService) {
                $scope.getColor = (exp)=> {
                    var level = levelService.compute(exp);
                    if (level > 20)
                        return '#9b59b6';
                    if (level > 16)
                        return '#1abc9c';
                    if (level > 13)
                        return '#2ecc71';
                    if (level > 10)
                        return '#e74c3c';
                    if (level > 7)
                        return '#e67e22';
                    if (level > 5)
                        return '#f39c12';
                    if (level > 2)
                        return '#2c3e50';
                    return '#7f8c8d';
                };
            }
        };
    }
})();