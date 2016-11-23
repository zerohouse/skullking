(function () {
    angular.module('app').directive('ajaxButton', ajaxButton);
    /* @ng-inject */
    function ajaxButton($ajax, $rootScope) {
        return {
            restrict: 'A',
            link: (scope, element)=> {
                $rootScope.$on('ajax-start', ()=> {
                    element.addClass('sending');
                }, scope);
                $rootScope.$on('ajax-done', ()=> {
                    element.removeClass('sending');
                }, scope);
            }
        };
    }
})();