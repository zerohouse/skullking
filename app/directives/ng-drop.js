(function () {
    angular.module('app').directive('ngDrop', ngDrop);
    /* @ng-inject */
    function ngDrop() {
        return {
            link: function (s, e, a) {
                $(e).droppable({
                    drop: function (event, ui) {
                        s.$data = angular.element(ui.draggable[0]).scope().$eval(ui.draggable.attr('ng-drag-data'));
                        s.$eval(a.ngDropSuccess);
                    }
                });
            }
        };
    }
})();