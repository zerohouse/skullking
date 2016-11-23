angular.module('app').filter('percent', function () {
    return function (value, valueKey, maxKey) {
        if (!value)
            return 0;
        var max = 100;
        if (value[maxKey])
            max = value[maxKey];
        var score = value[valueKey];
        return Math.floor(score * 1000 / max) / 10;
    };
});