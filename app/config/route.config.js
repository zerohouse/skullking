/* @ng-inject */
angular.module('app')
    .config(($locationProvider) => {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    })
    .run(function ($rootScope, $state, $window, loading, $location) {
        $rootScope.state = $state;
        $rootScope.$on('$stateChangeSuccess', function () {
            $window.ga('send', 'pageview', $location.path());
        });
        $rootScope.$on('$stateChangeStart', function () { //evt, to
            loading.start();
        });

        $window.onbeforeunload = function (event) {
            if ($state.current.exitConfirm)
                return function () {
                    var answer = confirm("변경사항이 유실됩니다.");
                    if (!answer) {
                        event.preventDefault();
                    }
                };
        };

    });