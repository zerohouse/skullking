(function () {
    angular.module('app').directive('fontColorPicker', fontColorPicker);
    /* @ng-inject */
    function fontColorPicker() {
        return {
            restrict: 'E',
            scope: {
                ngModel: '=',
                change: '=?'
            },
            templateUrl: '/directive/color-picker/font-color-picker/font.html',
            controller: function ($scope) {
                if (!$scope.ngModel)
                    $scope.ngModel = "rgb(52, 73, 94)";

                $scope.getIconColor = function () {
                    return $scope.ngModel;
                };

                $scope.isWhite = function () {
                    return $scope.ngModel === "rgb(255, 255, 255)";
                };

                $scope.getOpacity = function () {
                    if ($scope.init)
                        return 1;
                    return 0;
                };

                $scope.toggle = function () {
                    $scope.init = true;
                    $scope.selectMod = !$scope.selectMod;
                    return $scope.ngModel === "rgb(255, 255, 255)";
                };
            }

        };
    }
})();