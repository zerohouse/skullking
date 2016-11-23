(function () {
    angular.module('app').controller('courseEditCtrl', courseEditCtrl);
    /* @ng-inject */
    function courseEditCtrl(loading, $scope, $ajax, $state, $stateParams, pop) {

        if ($stateParams.id)
            $ajax.get('/api/v1/course', {id: $stateParams.id}).then(response=> {
                $scope.course = response.course;
                $scope.step = $scope.course.steps[0];
                loading.done();
            });
        else
            loading.done();

        $scope.course = {steps: [new Step()], name: '', level: -1};
        $scope.step = $scope.course.steps[0];
        $ajax.get("/api/v1/problem/list").then(list=> {
            $scope.problems = list;
            $scope.course.steps.forEach(step=> {
                step.problems.forEach(problem=> {
                    list.removeById(problem.id);
                });
            });
            loading.done();
        });

        $scope.newStep = function () {
            $scope.course.steps.push(new Step());
        };

        $scope.remove = step => {
            if ($scope.course.steps.length > 1)
                $scope.course.steps.remove(step);
        };

        $scope.selectStep = function (step) {
            $scope.step = step;
        };

        $scope.isSelected = step=> {
            return step === $scope.step;
        };

        function Step() {
            if (!$scope.course || !$scope.course.steps)
                this.name = "1 단계";
            else
                this.name = ($scope.course.steps.length + 1) + " 단계";
            this.problems = [];
            this.content = "";
        }

        function checkValid() {
            if (!$scope.course.name)
                pop.error("코스명을 정해주세요.");
            if (!$scope.course.description)
                pop.error("코스설명을 적어주세요.");
            if ($scope.course.level < 0)
                pop.error("난이도를 정해주세요.");
            $scope.course.steps.forEach((step, i)=> {
                if (!step.content)
                    pop.error((i + 1) + "번째 단계의 컨텐츠가 없습니다.");
                if (!step.name)
                    pop.error((i + 1) + "번째 단계의 이름이 없습니다.");
            });
        }

        $scope.submit = function () {
            checkValid();
            var param = {};
            param.name = $scope.course.name;
            param.level = $scope.course.level;
            param.id = $scope.course.id;
            param.description = $scope.course.description;
            var type = "생성";
            if (param.id)
                type = "수정";
            param.steps = $scope.course.steps.map(step=> {
                return {
                    id: step.id,
                    name: step.name,
                    content: step.content,
                    problems: step.problems.map(problem=>problem.id)
                };
            });

            $ajax.post('/api/v1/course', param, true).then(id=> {
                pop.alert("코스가 " + type + "되었습니다.");
                $state.go('course', {id: id});
            });

        };

    }
})();