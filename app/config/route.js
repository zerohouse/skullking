/* @ngInject */
angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("rooms", {
                url: "/",
                templateUrl: '/pages/rooms/rooms.html',
                controller: 'roomCtrl'
            })
            .state("game", {
                url: "/game/:id/:player",
                templateUrl: '/pages/game/game.html',
                controller: 'gameCtrl',
                layout: 'column'
            });


        $urlRouterProvider.otherwise("/404");
    });
