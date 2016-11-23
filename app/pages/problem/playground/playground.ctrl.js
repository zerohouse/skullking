(function () {
    angular.module('app').controller('problemPlaygroundCtrl', problemPlaygroundCtrl);
    /* @ng-inject */
    function problemPlaygroundCtrl($scope, $rootScope, $ajax, $stateParams, construct, pop, popup, Code, ConsoleService, $q, $hangul, types, $state, loading, $timeout) {

        $scope.console = new ConsoleService(".flex.console");
        $scope.open = true;

        $scope.isChanged = ()=> {
            if (!$scope.selectedLanguage)
                return false;
            if (!$scope.selectedLanguage.code)
                return $scope.selectedLanguage.predefinedCode !== $scope.selectedLanguage.text;
            return $scope.selectedLanguage.text !== $scope.selectedLanguage.code.text && $scope.selectedLanguage.predefinedCode !== $scope.selectedLanguage.text;
        };

        $scope.aceLoaded = function (_editor) {
            _editor.$blockScrolling = Infinity;
            _editor.setHighlightActiveLine(true);
        };

        $timeout(function () { // 사파리 Height
            var el = $('.editor');
            if (!el.height()) {
                el.height($(window).height() / 2);
            }
        }, 300);

        $scope.selectTestCase = testCase=> {
            $scope.selectedTestCase = testCase;
        };

        $scope.userTest = [];

        $scope.back = (index)=> {
            $scope.selectedLanguage.text = $scope.selectedLanguage.code.back(index)[0];
        };

        $scope.now = ()=> {
            $scope.selectedLanguage.text = $scope.selectedLanguage.code.text;
        };

        $scope.first = ()=> {
            $scope.selectedLanguage.text = $scope.selectedLanguage.predefinedCode;
        };


        /*
         *
         * 문제 가져오기
         *
         * */


        $ajax.get('/api/v1/play/problem', {id: $stateParams.id}).then(result=> {
            setProblem(construct.problem(result.problem));
            loading.done();
            if (!result.solving)
                return;
            if (result.solving.language)
                $scope.selectedLanguage = $scope.problem.languages.find(langauge=>langauge.language === result.solving.language);
            if (result.solving.codes)
                result.solving.codes.forEach(code=> {
                    var find = $scope.problem.languages.find(langauge=>langauge.language === code.language);
                    if (!find) return;
                    find.code = Code.from(code);
                    find.text = find.code.text;
                });
            $scope.problemSolved = result.problem.submitted;
        });

        function setProblem(problem) {
            $scope.problem = problem;
            if ($rootScope.user.language)
                $scope.selectedLanguage = $scope.problem.languages.find(lang=>lang.language === $rootScope.user.language);
            else
                $scope.selectedLanguage = $scope.problem.languages[0];

            $scope.selectedTestCase = $scope.problem.testCases[0];
            $scope.problem.parameters.forEach((parameter, i)=> {
                if (!parameter.type.startsWith("LIST"))
                    return;
                $scope.userTest[i] = [];
            });
        }


        /*
         *
         * 튜토리얼
         *
         * */
        $scope.introStart = ()=> {
            $scope.tutorial = true;
            $scope.intro();
        };

        $scope.IntroOptions = {
            nextLabel: "다음",
            prevLabel: "이전",
            skipLabel: "넘기기",
            doneLabel: "완료",
            showStepNumbers: false,
            steps: [
                {
                    element: 'problem-detail',
                    intro: "문제 정보를 확인하세요.",
                    position: 'right'
                },
                {
                    element: '#step2',
                    intro: "여기를 눌러 사용할 언어를 선택합니다.",
                    position: 'right'
                },
                {
                    element: '#step3',
                    intro: "코드를 수정하면 저장하기 버튼이 보이고, 코드를 저장할 수 있습니다.",
                    position: 'left'
                },
                {
                    element: '#step4',
                    intro: "저장한 코드로 다시 돌아갈 수 있습니다.",
                    position: 'left'
                },
                {
                    element: '#step5',
                    intro: "코드를 실행해 볼 수 있습니다.",
                    position: 'left'
                },
                {
                    element: '#step6',
                    intro: " 코드를 다 작성했다면 제출해보세요. 경험치를 획득하고 레벨을 올립니다.",
                    position: 'left'
                },
                {
                    element: '.ui-resizable-handle.ui-resizable-e',
                    intro: "여기에 마우스를 대면 창 크기를 조절할 수 있습니다.",
                    position: 'right'
                },
                {
                    element: '.ui-resizable-handle.ui-resizable-s',
                    intro: "에디터 창도 줄여보세요.",
                    position: 'top'
                }
            ]
        };

        $scope.introExit = ()=> {
            $scope.tutorial = false;
        };


        /*
         *
         * 코드 저장
         *
         * */

        $scope.saveCode = ()=> {
            if (!$rootScope.user.id)
                popup.error("로그인이 필요합니다.");
            var param = {};
            if (!$scope.selectedLanguage.code)
                $scope.selectedLanguage.code = new Code($scope.selectedLanguage.text);
            else
                $scope.selectedLanguage.code.save($scope.selectedLanguage.text);
            param.codes = $scope.problem.languages.filter(language=>language.code).map(language=> {
                return language.code.toSave(language);
            });
            param.language = $scope.selectedLanguage.language;
            param.problemId = $stateParams.id;
            $ajax.post('/api/v1/play/saveCode', param, true).then(() => {
            }, ()=> {
                popup.error("코드 저장 중 문제가 발생했습니다. 코드 복사해 저장해주세요.");
            });
        };

        /*
         *
         * 테스트 실행 코드
         *
         * */

        $scope.codeRun = ()=> {
            if (!$rootScope.user.id)
                popup.error("로그인이 필요합니다.");
            popup.open('runcode', 'runcode', $scope);
        };

        $scope.runTest = option => {
            $scope.selectedLanguage.check($scope.selectedLanguage.text);
            if (option === "user") {
                if ($scope.problem.parameters.find((parameter, i)=>
                        !types.isValidParameter(parameter.type, $scope.userTest[i]
                        ))) pop.error("유효하지 않은 파라미터가 있습니다. 확인해주세요.");
                $scope.console.writeLineAndPop("사용자 정의 예제를 실행합니다.", "color-blue top-border");
                runTest([$scope.userTest]).then(result=> {
                    $scope.console.writeResult(result.executeResults[0]);
                });
                return;
            }
            var order = $scope.problem.testCases.indexOf($scope.selectedTestCase) + 1;
            $scope.console.writeLineAndPop("예제 " + $hangul["을를"](order) + " 실행합니다.", "color-blue top-border");
            runTest([$scope.selectedTestCase.data.slice(0, $scope.problem.parameters.length)]).then(result=> {
                $scope.console.writeResultWithAnswer(order, result.executeResults[0], $scope.selectedTestCase.data.last());
            });
        };

        $scope.runAll = () => {
            if (!$rootScope.user.id)
                popup.error("로그인이 필요합니다.");
            $scope.selectedLanguage.check($scope.selectedLanguage.text);
            $scope.console.writeLineAndPop("전체 예제를 실행합니다.", "color-blue top-border");
            runTest($scope.problem.testCases.map(testCase=>
                testCase.data.slice(0, $scope.problem.parameters.length)
            )).then(result=> {
                var score = 0;
                result.executeResults.forEach((executeResult, i)=> {
                    score += $scope.console.writeResultWithAnswer(i + 1, executeResult, $scope.problem.testCases[i].data.last());
                });
                $scope.console.writeLineAndPop("예제 " + $scope.problem.testCases.length + "개 중 " + score + "개 정답(" +
                    Math.floor(score / $scope.problem.testCases.length * 1000) / 10 +
                    "%)", "color-green top-border");
            });
        };

        function runTest(params) {
            return $q((ok)=> {
                var param = {};
                param.problemId = $stateParams.id;
                param.language = $scope.selectedLanguage.language;
                param.code = $scope.selectedLanguage.text;
                param.parameters = params;
                $ajax.post('/api/v1/play/runTest', param, true).then(result => {
                    if ($scope.selectedLanguage.compile) {
                        $scope.console.writeCompileResult(result.prepareResult);
                    }
                    if (!result.prepareResult.success)
                        return;
                    if (result.error) {
                        $scope.console.writeExecuteError(result);
                        return;
                    }
                    ok(result);
                });
            });
        }


        /*
         *
         * 코드 제출
         *
         * */


        $scope.codeSubmit = ()=> {
            if (!$rootScope.user.id)
                popup.error("로그인이 필요합니다.");
            popup.open('submitcode', 'runcode wide', $scope, ()=> {
                $scope.exit = false;
                $scope.submitted = false;
            });
        };

        $scope.submit = (open) => {
            $scope.submitted = true;
            var param = {};
            param.problemId = $stateParams.id;
            param.language = $scope.selectedLanguage.language;
            param.code = $scope.selectedLanguage.text;
            param.open = open;
            $ajax.post('/api/v1/play/submitCode', param, true).then(result => {
                $scope.problemSolved = true;
                if ($scope.selectedLanguage.compile) {
                    $scope.console.writeCompileResult(result.prepareResult);
                    // if (!result.prepareResult.success)
                    //     return;
                }
                if (result.executeError) {
                    $scope.console.writeExecuteError(result);
                    // return;
                }
                result.percent = Math.floor(result.score * 1000 / result.maxScore) / 10;
                $scope.result = result;
                $scope.exit = true;
                $rootScope.user.level.getExp += result.exp;
            });
        };

        /*
         *
         * 나가기 전에
         *
         * */
        $scope.exit = false;

        $scope.reset = ()=> {
            $scope.submitted = false;
            $scope.result = false;
            popup.close();
        };

        $scope.$on('$stateChangeStart', function (e, to, params) {
            loading.done();
            if ($scope.exit)
                return;
            e.preventDefault();
            popup.close();
            popup.confirm("변경사항이 유실됩니다. 정말로 나가시겠습니까?", "페이지 이동 확인").then(()=> {
                $scope.exit = true;
                $state.go(to.name, params);
            });
        });
    }
})();