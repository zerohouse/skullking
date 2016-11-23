(function () {
    angular.module('app').directive('dropdown', dropdown);
    /* @ng-inject */
    function dropdown() {
        return {
            restrict: 'E',
            templateUrl: '/directive/dropdown/dropdown.html',
            scope: {
                classes: '@',
                options: '=',
                placeholder: '@',
                selected: '=ngModel',
                ngChange: '=?',
                name: '@?'
            },
            controller: function ($scope) {
                $scope.select = select=> {
                    $scope.selected = select;
                    if($scope.ngChange)
                        $scope.ngChange(select);
                };
                $scope.getName = option=> {
                    if (!option)
                        return $scope.placeholder;
                    if ($scope.name)
                        return option[$scope.name];
                    return option;
                };
            }
        };
    }
})();