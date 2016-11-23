(function () {
    angular.module('app').controller('courseDetailCtrl', courseDetailCtrl);
    /* @ng-inject */
    function courseDetailCtrl(loading, $ajax, $stateParams, $scope, pop) {
        $ajax.get('/api/v1/course', {id: $stateParams.id}).then(response=> {
            $scope.course = response.course;
            $scope.registerInfo = response.registerInfo;
            $scope.step = $scope.course.steps[0];
            loading.done();
            $scope.loaded = true;
        });

        $scope.register = function () {
            $ajax.post('/api/v1/course/register', {id: $stateParams.id}).then(registerInfo=> {
                $scope.registerInfo = registerInfo;
                pop.alert("코스에 등록했습니다.");
            });
        };

        $scope.selectStep = function (step) {
            $scope.step = step;
        };

        $scope.isSelected = step=> {
            return step === $scope.step;
        };

    }
})();