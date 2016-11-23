(function () {
    var animate = {};
    var randoms = ['bounce', 'flash', 'rubberBand', 'shake', 'swing', 'tada', 'jello', 'bounceIn'];

    angular.module('app').directive('animate', animateDirective);
    /* @ng-inject */
    function animateDirective($timeout) {

        return {
            restrict: 'A',
            link: function (s, e, attr) {
                var type = attr.type;
                if (!type)
                    type = attr.animate;
                animate[attr.animate] = function () {
                    if (type === 'randomWow') {
                        doAnimate(randoms.random(), true);
                    }
                    doAnimate(type);
                };
                s.$on('$destroy', ()=> {
                    animate[attr.animate] = undefined;
                });

                function doAnimate(type, random) {
                    if (random)
                        $(e).removeClass('animated ' + randoms.join(" "));
                    else
                        $(e).removeClass('animated ' + type);
                    $timeout(()=> {
                        $(e).addClass('animated ' + type);
                    });
                }
            }
        };
    }

    angular.module('app').service('animateService', animateServiceFactory);
    /* @ng-inject */
    function animateServiceFactory() {
        return animate;
    }
})();