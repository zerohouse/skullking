(function () {
    angular.module('app').directive('codeView', codeView);
    /* @ng-inject */
    function codeView() {
        return {
            restrict: 'E',
            scope: {
                text: '=',
                hasCode: '=?'
            },
            link: function (s, e) {
                var codeBlockRegex = /#code([\w\W]*?)#end/ig;
                s.$watch('text', text=> {
                    if (!text)
                        return;
                    if (!codeBlockRegex.test(text)) {
                        e.html(text.removeTags().newLine());
                        return;
                    }
                    var blocks = [];
                    var splitted = text.split("#code");
                    if (splitted.length === 1)
                        return;
                    splitted.forEach((each, i)=> {
                        if (i === 0) {
                            blocks.push(new Block(each));
                            return;
                        }
                        var split = each.split("#end");
                        blocks.push(new Block(split[0], true));
                        blocks.push(new Block(split[1]));
                    });
                    blocks.forEach(block=> {
                        if (!block.code) {
                            var span = angular.element("<span></span>");
                            span.html(block.text.removeTags().newLine());
                            e.append(span);
                            return;
                        }
                        var code = angular.element("<pre class='prettyprint linenums'></pre>");
                        code.text(block.text);
                        e.append(code);
                    });
                    s.hasCode = true;
                    PR.prettyPrint();
                });

                function Block(text, code) {
                    this.code = code;
                    this.text = text;
                }
            }
        };
    }
})();