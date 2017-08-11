/* @ngInject */
angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("skullkingrooms", {
                url: "/skullking/rooms",
                templateUrl: '/pages/skullking/rooms/rooms.html',
                controller: 'roomCtrl'
            })
            .state("skullking", {
                url: "/skullking/:id/:player",
                templateUrl: '/pages/skullking/skullking.html',
                controller: 'skullkingCtrl',
                layout: 'column'
            })
            .state("puzzlerooms", {
                url: "/puzzle/rooms",
                templateUrl: '/pages/puzzle/rooms.html',
                controller: 'puzzleRoomCtrl',
                layout: 'column'
            })
            .state("puzzleSingle", {
                url: "/puzzle",
                templateUrl: '/pages/puzzle/puzzleSingle.html',
                controller: 'puzzleSingleCtrl',
                layout: 'column'
            })
            .state("puzzle", {
                url: "/puzzle/:diff",
                templateUrl: '/pages/puzzle/puzzle.html',
                controller: 'puzzleCtrl',
                layout: 'column'
            });


        $urlRouterProvider.otherwise("/");
    });
