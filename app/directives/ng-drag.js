(function () {
    angular.module('app').directive('ngDrag', ngDrag);
    /* @ng-inject */
    function ngDrag() {
        return {
            link: function (s, e) {
                var position;
                $(e).draggable({
                    start: function () {
                        position = {
                            left: $(this).css('left'),
                            top: $(this).css('top')
                        };
                    },
                    stop: function () {
                        $(this).animate({top: position.top, left: position.left}, 150);
                    }
                });
            }
        };
    }
})();