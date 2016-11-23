/* @ngInject */
angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("welcome", {
                url: "/",
                templateUrl: '/pages/welcome/welcome.html',
                controller: 'welcomeCtrl',
                layout: 'column'
            });


        $urlRouterProvider.otherwise("/404");
    });
