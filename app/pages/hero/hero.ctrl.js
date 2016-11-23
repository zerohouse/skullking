(function () {
    angular.module('app').controller('heroCtrl', heroCtrl);
    /* @ng-inject */
    function heroCtrl($scope, $stateParams, construct, $ajax, loading, types, animateService, $rootScope) {

        $scope.isRootUser = function () {
            return $scope.hero && $rootScope.user.id === $scope.hero.id;
        };

        $scope.animate = animateService;

        $scope.recommends = function () {
            if (!$scope.hero || !$scope.hero.solveCodes)
                return;
            var result = 0;
            $scope.hero.solveCodes.forEach(solveCode=> {
                result += solveCode.likes.length;
            });
            return result;
        };

        $scope.limit = 2;
        $scope.more = ()=> {
            $scope.limit += 2;
        };

        var init = ()=> {
            $ajax.get('/api/v1/user', {id: $stateParams.id}).then(hero => {
                setHero(hero);
                loading.done();
            });
        };
        init();

        $scope.languageName = languageName;

        $scope.next = function (problem) {
            problem.index++;
            if (problem.index > problem.solveCodes.length - 1)
                problem.index = problem.solveCodes.length - 1;
        };

        $scope.before = function (problem) {
            problem.index--;
            if (problem.index < 0)
                problem.index = 0;
        };


        function languageName(type) {
            return types.languageMap[type].name;
        }


        function setHero(hero) {
            if (!hero || !hero.id)
                return;
            $scope.hero = construct.hero(hero);
            $scope.languages = construct.solveCodeList(hero.solveCodes).languages;
            angular.forEach($scope.languages, function (value, k) {
                if (!$scope.most || $scope.most.value < value)
                    $scope.most = {value: value, language: languageName(k), name: getMostName(value)};
            });
            if ($scope.hero.level && $scope.hero.level.getExp)
                levelUpdate();

            /*
             검색
             */
            $scope.query = {level: 0};
            $scope.getQuery = function () {
                if (!$scope.query)
                    return;
                var query = {};
                if ($scope.query.keyword)
                    return $scope.query.keyword;
                if ($scope.query.level > 0) {
                    query.level = $scope.query.level;
                    return query;
                }
            };


            /*
             레벨 및 태그 통계계산
             */
            var tags = {};
            var levels = {};
            $scope.problemStastics = {submit: 0, pass: 0, score: 0, maxScore: 0};
            hero.solveCodes.forEach(solveCode=> {
                $scope.problemStastics.maxScore += solveCode.maxScore;
                $scope.problemStastics.score += solveCode.score;
            });
            $scope.problemStastics.percent = Math.floor($scope.problemStastics.score * 1000 / $scope.problemStastics.maxScore) / 10;
            $scope.hero.problems.forEach(problem=> {
                problem.solveCodes = hero.solveCodes.filter(solveCode=>solveCode.problemId === problem.id);
                problem.solveCodes.sort((o1, o2)=> o2.id - o1.id);
                if (problem.solveCodes && problem.solveCodes.length > 0)
                    $scope.problemStastics.submit++;
                problem.index = 0;
                problem.tags.forEach(tag=> {
                    if (!tags[tag.text])
                        tags[tag.text] = {pass: 0, size: 0};
                    tags[tag.text].size++;
                    if (problem.solveCodes.find(solveCode=>solveCode.maxScore === solveCode.score))
                        tags[tag.text].pass++;
                });
                if (!levels[problem.level])
                    levels[problem.level] = {pass: 0, size: 0};
                levels[problem.level].size++;
                if (problem.solveCodes.find(solveCode=>solveCode.maxScore === solveCode.score)) {
                    levels[problem.level].pass++;
                    $scope.problemStastics.pass++;
                }
            });
            $scope.tags = {labels: [], pass: [], size: []};
            angular.forEach(tags, (value, key)=> {
                $scope.tags.labels.push(key);
                $scope.tags.pass.push(value.pass);
                $scope.tags.size.push(value.size);
            });
            $scope.levels = {labels: [], pass: [], size: []};
            angular.forEach(levels, (value, key)=> {
                $scope.levels.labels.push(key);
                $scope.levels.pass.push(value.pass);
                $scope.levels.size.push(value.size);
            });

            $scope.hero.problems.sort((p1, p2)=> {
                var p1Id = 0;
                var p2Id = 0;
                if (p1.solveCodes[0])
                    p1Id = p1.solveCodes[0].id;
                if (p2.solveCodes[0])
                    p2Id = p2.solveCodes[0].id;
                return p2Id - p1Id;
            });
        }


        function levelUpdate() {
            if (animateService.randomWow)
                $scope.hero.level.update(500, animateService.randomWow);
        }

        function getMostName(val) {
            if (val > 100) {
                return "변태";
            }
            if (val > 50) {
                return "마스터";
            }
            if (val > 20) {
                return "중독자";
            }
            if (val > 10) {
                return "원어민";
            }
            if (val > 3) {
                return "수행자";
            }
            if (val > 0) {
                return "스타터";
            }
        }

    }
})();