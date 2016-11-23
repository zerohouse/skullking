(function () {
    angular.module('app').controller('solveCodesCtrl', solveCodesCtrl);
    /* @ng-inject */
    function solveCodesCtrl($scope) {
        $scope.limit = 0;

        $scope.more = ()=> {
            $scope.limit += 5;
        };

        if (!$scope.limit)
            $scope.more();

    }
})();
