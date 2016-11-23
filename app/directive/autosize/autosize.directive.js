(function () {
    angular.module('app').directive('autosize', autoSize);
    /* @ng-inject */
    function autoSize($sniffer) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var node = element[0];
                var lineHeight = getLineHeight(node);

                element.on('input', adjust);
                element.on('change', adjust);

                scope.$watch(attrs.ngModel, adjust);

                scope.$watch(function () {
                    return node.offsetHeight || node.offsetWidth;
                }, function (newVal, oldVal) {
                    if (newVal && !oldVal)
                        adjust();
                });

                adjust();

                function adjust() {
                    if (isNaN(lineHeight)) lineHeight = getLineHeight(node);
                    if (!(node.offsetHeight || node.offsetWidth)) return;
                    if (node.scrollHeight <= node.clientHeight)
                        node.style.height = '0px';
                    var h = node.scrollHeight +
                        node.offsetHeight -
                        node.clientHeight;
                    node.style.height = Math.max(h, lineHeight) +
                        ($sniffer.msie && lineHeight ? lineHeight : 0) + 'px';
                }
            }
        };
    }

    function getLineHeight(node) {
        var computedStyle = window.getComputedStyle(node);
        var lineHeightStyle = computedStyle.lineHeight;
        if (lineHeightStyle === 'normal') return +computedStyle.fontSize.slice(0, -2);
        else return +lineHeightStyle.slice(0, -2);
    }
})();

