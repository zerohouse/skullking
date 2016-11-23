(function () {
    angular.module('app').directive('radioButtons', radioButton);
    /* @ng-inject */
    function radioButton() {
        return {
            restrict: 'E',
            templateUrl: '/directive/radiobuttons/radiobuttons.html',
            scope: {
                ngModel: '=',
                options: '=',
                label: '@',
                value: '@'
            },
            controller: function ($scope) {
                $scope.getIcon = (option) => {
                    if ($scope.ngModel === option)
                        return "radio_button_checked";
                    return "radio_button_unchecked";
                };

                $scope.isOptionSelected = option=> {
                    return option === $scope.ngModel;
                };

                $scope.setOption = option=> {
                    if ($scope.value) {
                        $scope.ngModel = option[$scope.value];
                        return;
                    }
                    $scope.ngModel = option;
                };

                $scope.getValue = option=> {
                    if ($scope.value) 
                        return option[$scope.value];
                    return option;
                };

                $scope.getLabel = option=> {
                    if ($scope.label)
                        return option[$scope.label];
                    return option;
                };
            }
        };
    }
})();