(function () {
    angular.module('app').directive('checkbox', checkbox);
    /* @ng-inject */
    function checkbox() {
        return {
            restrict: 'E',
            templateUrl: '/directive/checkbox/checkbox.html',
            scope: {
                ngModel: '=',
                label: '='
            },
            controller: function ($scope) {
                $scope.getIcon = () => {
                    if ($scope.ngModel)
                        return "check_box";
                    return "check_box_outline_blank";
                };
            }
        };
    }
})();