angular.module('app').filter('language', function (types) {
    return function (language) {
        return types.languageMap[language].name;
    };
});