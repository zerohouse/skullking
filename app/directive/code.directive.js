angular.module('app').directive('code', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.code, function (code) {
                if (code === null) {
                    code = "  /* \n" +
                        "   * 아직 문제를 풀지 않아 코드를 열람할 수 없습니다. \n" +
                        "   */";
                }
                var codeBlock = angular.element("<pre class='prettyprint linenums'></pre>");
                codeBlock.text(code);
                element.html('');
                element.append(codeBlock);
                PR.prettyPrint();
            });
        }
    };
});

