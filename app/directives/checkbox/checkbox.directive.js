(function () {
    angular.module('app').directive('checkbox', checkbox);
    /* @ng-inject */
    function checkbox() {
        return {
            restrict: 'E',
            templateUrl: '/directives/checkbox/checkbox.html',
            scope: {
                ngModel: '=',
                label: '@'
            },
            controller: function ($scope) {
                $scope.getIcon = () => {
                    if ($scope.ngModel)
                        return "fa-check-square-o";
                    return "fa-square-o";
                };
            }
        };
    }
})();