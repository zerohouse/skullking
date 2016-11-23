angular.module('app').filter('level', function (levelService) {
    return function (exp) {
        return levelService.compute(exp);
    };
});