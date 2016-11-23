/* jshint ignore :start */
angular.module('app').controller('problemEditCtrl', problemEditCtrl);
/* @ng-inject */
function problemEditCtrl($scope, types, popup, $ajax, pop, $q, $state, $stateParams, construct, loading) {

    if ($stateParams.id)
        $ajax.get('/api/v1/problem', {id: $stateParams.id}).then(problem=> {
            $scope.problem = construct.problem(problem);
            loading.done();
        });
    else
        loading.done();

    $scope.problem = {
        constraints: [],
        parameters: [],
        testCases: [],
        tags: [],
        level: 0,
        policy: "PUBLIC"
    };

    $scope.policies = [
        {value: "PUBLIC", label: "공개"},
        {value: "PRIVATE", label: "비공개"}
    ];


    function isModify() {
        return $stateParams.id !== undefined;
    }

    /*
     *
     * 태그 추가
     *
     * */

    $scope.recommedTags = ["구현능력", "그래프", "계산기하", "동적계획법", "문자열", "수치해석",
        "자료구조", "탐색", "게임", "비트마스크", "이진탐색", "수학", "정수론", "경우의수", "분할정복", "정렬"];

    $scope.addTag = (text)=> {
        if ($scope.problem.tags.findBy("text", text))
            return;
        $scope.problem.tags.push({text: text});
    };

    $scope.$watch('problem.tags', tags=> {
        if (tags && tags.length > 10)
            tags.splice(10)
    }, true);

    $scope.loadFrom = function (query) {
        return $q((ok)=> {
            ok($scope.recommedTags.filter(tag=>tag.match(query)).map(tag=> {
                return {
                    text: tag
                };
            }));
        });
    };


    /*
     *
     * 기본적인 요소 추가 작업
     *
     * */

    $scope.parameterTypes = types.parameters;

    $scope.addConstraint = ()=> {
        if ($scope.problem.constraints.length >= 10) {
            pop.alert("제약 사항은 최대 10개까지 만들 수 있습니다.");
            return;
        }
        $scope.problem.constraints.push({});
    };

    $scope.addTestCase = ()=> {
        if ($scope.problem.testCases.length >= 10) {
            pop.alert("예제는 최대 10개까지 만들 수 있습니다.");
            return;
        }
        $scope.problem.testCases.push(new TestCase());
    };

    $scope.addParameter = ()=> {
        $scope.problem.parameters.push(new Parameter());
    };


    /*
     *
     * 랜덤 케이스 생성
     *
     * */

    $scope.generateRandomCases = (codeLanguage, code)=> {
        checkProblemParameters();
        if (!codeLanguage)
            pop.error("언어를 선택해 주세요.");
        if (!code)
            pop.error("정답 코드를 작성해주세요.");
        var param = {};
        param.code = code;
        param.language = codeLanguage.language;
        param.parameters = $scope.problem.parameters.map(parameter=> parameter.type);
        param.returnType = $scope.problem.returnType;
        codeLanguage.check(code);
        $ajax.post('/api/v1/problem/generate-testcases', param, true).then((data)=> {
            if (!data.prepareResult.success) {
                popup.error("<h5>컴파일 에러</h5>\n" +
                    "    <div style=\"font-size:15px;line-height: 160%\">" +
                    data.prepareResult.message.newLine() +
                    "    </div>", "wide");
            }
            if (data.executeError) {
                popup.error("    <div style=\"font-size:15px;line-height: 160%\">" + +"<strong>실행 중 오류 발생</strong><br>" +
                    data.executeError.newLine() +
                    "    </div>", "wide");
            }
            pop.success("데이터 생성 완료");
            setData(data.executeResults.map(datum=> {
                var result = [];
                angular.copy(datum.parameters, result);
                result.push(datum.output);
                return result;
            }));
        })
    };

    $scope.languages = types.languages;
    $scope.languages.forEach(language=>language.use = true);
    $scope.language = $scope.languages[0];
    $scope.useTemplate = true;

    $scope.$watch('languages', ()=> {
        var usedLanguages = $scope.languages.filter(language=> language.use);
        if (usedLanguages.length === 0) {
            pop.alert("최소 한개의 언어는 선택해야 합니다.");
            $scope.problem.languages = $scope.problem.languages[0].use = true;
            return;
        }
        if (!usedLanguages.contains($scope.language))
            $scope.language = usedLanguages[0];
        $scope.problem.languages = usedLanguages;
    }, true);

    $scope.answerDataInfo = ()=> {
        popup.open("answerDataInfo", "wide");
    };

    $scope.csvHowTo = ()=> {
        popup.open("csvInfo", "wide");
    };

    $scope.generateHowTo = ()=> {
        popup.open("generate", "wide");
    };


    /*
     *
     * 업데이트 템플릿 코드
     *
     * */

    $scope.$watch('problem.parameters', updatePredefinedCode, true);
    $scope.$watch('problem.returnType', updatePredefinedCode, true);

    function updatePredefinedCode() {
        if (!$scope.useTemplate)
            return;
        $scope.languages.forEach(langauge=>langauge.defineCode($scope.problem.parameters, $scope.problem.returnType));
        updateTestCases($scope.problem.testCases);
    }

    function updateTestCases(testCases) {
        if (isModify()) // 수정 모드면 안함
            return;
        testCases.forEach(testCase=> {
            $scope.problem.parameters.forEach((parameter, i)=> {
                if (!parameter.type)
                    return;
                if (!isSameType(parameter.type, testCase.data[i]))
                    testCase.data[i] = getJSDefaultValue(parameter.type);
            });
            if (!$scope.problem.returnType)
                return;
            if (!isSameType($scope.problem.returnType, testCase.data[$scope.problem.parameters.length]))
                testCase.data[$scope.problem.parameters.length] = getJSDefaultValue($scope.problem.returnType);
        });

    }

    function isSameType(type, instance) {
        if (type === "INT" || type === "LONG")
            return typeof instance === "number";
        if (type === "STRING")
            return typeof instance === "string";
        if (type === "BOOLEAN")
            return typeof instance === "boolean";
        if (!angular.isArray(instance))
            return false;
        if (type === "LIST_INT" || type === "LIST_LONG")
            return typeof instance[0] === "number";
        if (type === "LIST_STRING")
            return typeof instance[0] === "string";
        if (type === "LIST_BOOLEAN")
            return typeof instance[0] === "boolean";
    }

    $scope.dataOptions = [{type: "typing", label: "직접입력"},
        {type: "file", label: "파일에서 추출(csv)"},
        {type: "generate", label: "정답코드로 생성"}];
    $scope.dataType = $scope.dataOptions[0];

    $scope.setData = input => {
        if (!input)
            pop.error("데이터가 없습니다.");
        setData(extract(input));
    };


    $scope.parseCsv = (file)=> {
        if (!file)
            pop.error("파일이 없습니다.");
        file.getString().then(fileString=> {
            setData(CSVToArray(fileString));
        });
    };

    $scope.showDataToggle = ()=> {
        if (!$scope.makeData)
            $scope.makeData = true;
        $scope.showData = !$scope.showData;
    };


    /*
     *
     * 문제 생성
     *
     * */

    $scope.createProblem = () => {
        if (!$scope.problem.name)
            pop.error("문제 이름을 정해주세요.");
        if (!$scope.problem.description)
            pop.error("문제 설명을 적어주세요.");
        if ($scope.problem.constraints.find(constraint=>!constraint))
            pop.error("제약조건을 완성해 주세요.");
        if ($scope.problem.constraints.length > 10)
            pop.error("제약조건은 최대 10개입니다.");
        if ($scope.problem.tags.length > 10)
            pop.error("태그는 최대 10개입니다.");
        if (!isModify())
            checkAnswerData();
        checkProblemParameters();
        if ($scope.problem.parameters.find(parameter=>!parameter.name))
            pop.error("이름이 없는 파라미터가 있습니다. 이름을 정해주세요.");
        if ($scope.problem.parameters.find(parameter=>!parameter.name))
            pop.error("이름이 없는 파라미터가 있습니다. 이름을 정해주세요.");
        if ($scope.problem.parameters.find((parameter, i)=>$scope.problem.parameters.find((param, j)=> (i !== j) && ( param.name === parameter.name))))
            pop.error("이름이 중복된 파라미터가 있습니다. 이름을 바꿔주세요.");
        if ($scope.problem.testCases.length === 0)
            pop.error("예제를 만들어 주세요.");
        if ($scope.problem.testCases.length > 10)
            pop.error("예제는 최대 10개입니다.");
        if ($scope.problem.testCases.find((testCase, j)=> {
                if ($scope.problem.parameters.find((parameter, i)=>
                        !types.isValidParameter(parameter.type, testCase.data[i]
                        ))) pop.error("예제 " + (j + 1) + "에 유효하지 않은 파라미터가 있습니다. 확인해주세요.");
            }))
            return;
        var param = {};
        angular.copy($scope.problem, param);
        $ajax.post('/api/v1/problem', param, true).then(id=> {
            if (!isModify())
                pop.alert("문제가 생성되었습니다.");
            else
                pop.alert("문제가 수정되었습니다.");
            $state.go("problemDetail", {id: id});
        });
    };

    function checkAnswerData() {
        if (!$scope.problem.data)
            pop.error("정답 데이터가 없습니다. 정답 데이터를 입력해주세요.");
        if ($scope.problem.data.length < 10)
            pop.error("평가를 위해 정답 데이터는 최소 10개가 필요합니다");
        if ($scope.problem.data.length > 100)
            pop.error("정답 데이터는 최대 100개 입니다.");
    }

    function checkProblemParameters() {
        if ($scope.problem.parameters.length === 0)
            pop.error("파라미터를 정의해주세요.");
        if ($scope.problem.parameters.length > 10)
            pop.error("파라미터는 최대 10개입니다.");
        if ($scope.problem.parameters.find(parameter=>!parameter.type))
            pop.error("파라미터의 타입을 정해주세요.");
        if (!$scope.problem.returnType)
            pop.error("리턴 타입을 정해주세요.");
    }

    function setData(data) {
        $scope.problem.data = data.slice(0, 100); //100개 까지만
        typeResolve(data[0]);
        var length = 3;
        if (data.length < length)
            length = data.length;
        var testCaseLength = $scope.problem.testCases.length;
        for (var i = 0; i < length - testCaseLength; i++) {
            $scope.addTestCase();
            $scope.problem.testCases[i].data = data[i];
        }
    }

    function CSVToArray(strData) {
        var strDelimiter = ",";
        var objPattern = new RegExp((
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        var arrData = [[]];
        var arrMatches;
        while (arrMatches = objPattern.exec(strData)) {
            var strMatchedDelimiter = arrMatches[1];
            if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter))
                arrData.push([]);
            var strMatchedValue;
            if (arrMatches[2]) {
                strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"), "\"");
            } else {
                strMatchedValue = arrMatches[3];
            }
            arrData[arrData.length - 1].push(getParsedValue(strMatchedValue));
        }
        return arrData;
    }

    function JSONparse(value) {
        try {
            return JSON.parse(value);
        } catch (e) {
            pop.alert("인풋 데이터 형식이 다릅니다.");
            throw "인풋 데이터 형식이 다릅니다.";
        }
    }

    function getParsedValue(value) {
        if (!isNaN(value))
            return parseFloat(value);
        if (value.startsWith("[")) {
            var result = JSONparse(value);
            for (var i = 0; i < result.length; i++) {
                result[i] = ifBooleanGetBoolean(result[i]);
            }
            return result;
        }
        return ifBooleanGetBoolean(value);
    }

    function ifBooleanGetBoolean(value) {
        if (value === "TRUE" || value === "true")
            return true;
        if (value === "FALSE" || value === "false")
            return false;
        return value;
    }


    function extract(input) {
        return input.split("\n").map(line=> JSONparse("[" + line + "]"));
    }

    function typeResolve(params) {
        var length = $scope.problem.parameters.length;
        if (params.length - 1 > length) { // -1은 리턴타입을 뺀 인덱스를 계산하기 위해 problem.data는 return type을 어레이 마지막 요소로 가짐
            for (var i = 0; i < params.length - 1 - length; i++) {
                $scope.problem.parameters.push(new Parameter());
            }
        }
        params.forEach((param, i)=> {
            if (i === params.length - 1) {
                if (!isSameType($scope.problem.returnType, param))
                    $scope.problem.returnType = getType(param);
                return;
            }
            if (!isSameType($scope.problem.parameters[i].type, param))
                $scope.problem.parameters[i].type = getType(param);
        });
    }

    function getType(input) {
        if (typeof input === "string")
            return "STRING";
        if (typeof input === "boolean")
            return "BOOLEAN";
        if (input.length === undefined)
            return "INT";
        return "LIST_" + getType(input[0]);
    }

    function Parameter() {
        this.name = "arg" + $scope.problem.parameters.length;
    }

    function TestCase() {
        this.data = [];
        updateTestCases([this]);
    }

    function getJSDefaultValue(type) {
        if (type === "INT" || type === "LONG")
            return 0;
        if (type === "STRING")
            return '';
        if (type === "BOOLEAN")
            return false;
        return [];
    }

}