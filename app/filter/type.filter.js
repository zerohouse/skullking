angular.module('app').filter('type', function (types) {
    return function (type, language) {
        if (!language) {
            return types.defaultType[type];
        }
        var typeDefine = types.languageMap[language.language].type;
        if (typeof typeDefine === "object")
            return typeDefine[type];
        return typeDefine;
    };
});