(function () {
    angular.module('app').controller('codeReviewCtrl', codeReviewCtrl);
    /* @ng-inject */
    function codeReviewCtrl($stateParams, $scope, construct, $ajax, loading, $rootScope) {
        $scope.open = true;
        $ajax.get('/api/v1/solveCode', {id: $stateParams.id}).then(solveCode=> {
            $scope.solveCode = construct.solveCode(solveCode);
            loading.done();
            if ($scope.solveCode.user.id !== $rootScope.user.id)
                return;
            $scope.solveCode.open = $scope.solveCode.policy === "PUBLIC";
            $scope.update = function (open) {
                if ($scope.updating)
                    return;
                $scope.updating = true;
                $ajax.post('/api/v1/solveCode/open', {id: solveCode.id, open: !open}).then(policy=> {
                    $scope.solveCode.open = policy === "PUBLIC";
                    $scope.updating = false;
                });
            };
        });
    }
})();