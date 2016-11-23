(function () {
    angular.module('app').controller('problemDetailCtrl', problemDetailCtrl);
    /* @ng-inject */
    function problemDetailCtrl($scope, $ajax, $stateParams, construct, $rootScope, loading) {
        $scope.myCodes = [];
        $scope.solveCodes = [];
        $ajax.get('/api/v1/problem', {id: $stateParams.id}).then(problem=> {
            $scope.problem = construct.problem(problem);
            loading.done();
        });

        $ajax.get('/api/v1/solveCode/problem', {id: $stateParams.id}).then(list=> {
                var statistics = construct.solveCodeList(list);
                $scope.percent = statistics.percent;
                $scope.memory = statistics.memory;
                $scope.time = statistics.time;
                $scope.solvePeoples = statistics.solvePeoples;
                $scope.length = list.length;

                list.forEach(solveCode=> {
                    if (solveCode.user.id === $rootScope.user.id)
                        $scope.myCodes.push(solveCode);
                    else
                        $scope.solveCodes.push(solveCode);
                });

                $scope.solveCodes.sort((s1, s2)=> s2.likes.length - s1.likes.length);
                $scope.languages = statistics.languages;
            }
        );
        
    }
})
();