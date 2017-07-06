(function () {
    angular.module('app').directive('ngDrag', ngDrag);
    /* @ng-inject */
    function ngDrag() {
        return {
            link: function (s, e) {
                $(e).draggable({revert: true, revertDuration: 200});
            }
        };
    }
})();