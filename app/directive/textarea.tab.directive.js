(function () {
    angular.module('app').directive('textarea', textarea);
    /* @ng-inject */
    function textarea() {
        return {
            restrict: 'E',
            link: function (s, e) {
                var el = $(e);
                el.keydown(function (e) {
                    if (e.keyCode === 9) { // tab was pressed
                        // get caret position/selection
                        var val = el[0].value,
                            start = el[0].selectionStart,
                            end = el[0].selectionEnd;

                        // set textarea value to: text before caret + tab + text after caret
                        el[0].value = val.substring(0, start) + '\t' + val.substring(end);

                        // put caret at right position again
                        el[0].selectionStart = el[0].selectionEnd = start + 1;

                        // prevent the focus lose
                        return false;

                    }
                });
            }
        };
    }
})();