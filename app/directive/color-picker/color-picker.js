(function () {
    angular.module('app').directive('colorPicker', colorPicker);
    /* @ng-inject */
    function colorPicker() {
        return {
            restrict: 'E',
            scope: {
                ngModel: '=',
                change: '=',
                display: '@'
            },
            templateUrl: '/directive/color-picker/color-picker.html',
            controller: function ($scope) {

                $scope.getColor = function (color) {
                    if (color === "rgb(209, 215, 219)" || color === "rgb(255, 255, 255)")
                        return "#000";
                };

                $scope.colors = [
                    ["rgb(26, 188, 156)", "rgb(241, 196, 15)"], ["rgb(46, 204, 113)", "rgb(230, 126, 34)"], ["rgb(52, 152, 219)", "rgb(231, 76, 60)"],
                    ["rgb(155, 89, 182)", "rgb(149, 165, 166)"], ["rgb(52, 73, 94)", "rgb(209, 215, 219)"], ["rgb(0, 0, 0)", "rgb(255, 255, 255)"]
                ];

                $scope.select = function (color) {
                    $scope.ngModel = color;
                    if($scope.change)
                        $scope.change();
                };

                $scope.isSelected = function (color) {
                    return $scope.ngModel === color;
                };

            }

        };
    }
})();