(function () {
    angular.module('app').directive('blankSref', blankSref);
    /* @ng-inject */
    function blankSref($window, $state) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on('click', ()=> {
                    if (attr.blankSref.match(",")) {
                        var stateAndParam = attr.blankSref.split(",");
                        var state = stateAndParam[0];
                        var param = JSON.parse(stateAndParam[1]);
                        $window.open($state.href(state, param), '_blank');
                        return;
                    }
                    $window.open($state.href(attr.blankSref), '_blank');
                });
            }
        };
    }
})();
