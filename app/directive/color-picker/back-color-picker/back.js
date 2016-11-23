(function () {
    angular.module('app').directive('backColorPicker', backColorPicker);
    /* @ng-inject */
    function backColorPicker() {
        return {
            restrict: 'E',
            scope: {
                ngModel: '=',
                change:'=?'
            },
            templateUrl: '/directive/color-picker/back-color-picker/back.html',
            controller: function ($scope) {
                if (!$scope.ngModel)
                    $scope.ngModel = "rgb(255, 255, 255)";

                $scope.getIconColor = function () {
                    return $scope.ngModel;
                };

                $scope.isWhite = function () {
                    return !$scope.ngModel || $scope.ngModel === "rgb(255, 255, 255)";
                };
                $scope.getOpacity = function () {
                    if ($scope.init)
                        return 1;
                    return 0;
                };

                $scope.toggle = function(){
                    $scope.init = true;
                    $scope.selectMod=!$scope.selectMod;
                };
            }

        };
    }
})();