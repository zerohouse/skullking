(function () {
    angular.module('app').service('loading', loading);
    /* @ng-inject */
    function loading($timeout) {
        this.start = function (el) {
            if(!el)
                el = $('[ui-view]');
            el.removeClass('loaded');
            el.addClass('loading');
        };
        this.done = function (el) {
            if(!el)
                el = $('[ui-view]');
            el.removeClass('loading');
            $timeout(function () {
                el.addClass('loaded');
            }, 300);
        };
    }
})();