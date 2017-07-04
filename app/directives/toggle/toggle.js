(function () {
    angular.module('app').directive('toggle', toggle);
    /* @ng-inject */
    function toggle() {
        return {
            restrict: 'E',
            scope: {
                toggle: '@',
                icon: '@'
            },
            templateUrl: '/directives/toggle/toggle.html',
            link: function (s, e) {
                $(e).bind('click', function () {
                    s.$parent[s.toggle] = !s.$parent[s.toggle];
                    s.$apply();
                });
            }

        };
    }
})();