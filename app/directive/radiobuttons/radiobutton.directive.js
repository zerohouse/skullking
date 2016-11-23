(function () {
    angular.module('app').directive('radioButton', radioButton);
    /* @ng-inject */
    function radioButton() {
        return {
            restrict: 'E',
            templateUrl: '/directive/radiobuttons/radiobutton.html',
            scope: {
                ngModel: '=',
                value: '=',
                label: '='
            },
            controller: function ($scope) {
                $scope.getIcon = () => {
                    if ($scope.isOptionSelected())
                        return "radio_button_checked";
                    return "radio_button_unchecked";
                };

                $scope.isOptionSelected = () => {
                    return $scope.value === $scope.ngModel;
                };

            }
        };
    }
})();