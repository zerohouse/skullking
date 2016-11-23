/* @ngInject */
angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("welcome", {
                url: "/",
                templateUrl: '/pages/welcome/welcome.html',
                controller: 'welcomeCtrl',
                layout: 'column'
            })
            .state("game", {
                url: "/game",
                templateUrl: '/pages/game/game.html',
                controller: 'gameCtrl',
                layout: 'column'
            })
            .state("game", {
                url: "/game",
                templateUrl: '/pages/game/game.html',
                controller: 'gameCtrl',
                layout: 'column'
            })
            .state("game.status", {
                url: "/status",
                templateUrl: '/pages/game/status/status.html',
                layout: 'column'
            })
            .state("game.info", {
                url: "/info",
                templateUrl: '/pages/game/info/info.html',
                layout: 'column'
            })
            .state("game.action", {
                url: "/action",
                templateUrl: '/pages/game/action/action.html',
                layout: 'column'
            });
        ;




        $urlRouterProvider.otherwise("/404");
    });
