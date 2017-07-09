/* @ngInject */
angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("rooms", {
                url: "/",
                templateUrl: '/pages/rooms/rooms.html',
                controller: 'roomCtrl'
            })
            .state("skullking", {
                url: "/skullking/:id/:player",
                templateUrl: '/pages/skullking/skullking.html',
                controller: 'skullkingCtrl',
                layout: 'column'
            })
            .state("checkGame", {
                url: "/check/:id/:player",
                templateUrl: '/pages/check/check.html',
                controller: 'checkCtrl',
                layout: 'column'
            });


        $urlRouterProvider.otherwise("/");
    });
