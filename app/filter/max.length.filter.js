angular.module('app').filter('maxLength', function () {
    return function (string, length, delimiter) {
        if (delimiter === undefined)
            delimiter = "...";
        if (!string || !string.length)
            return string;
        if (string.length < length)
            return string;
        return string.substr(0, length) + delimiter;
    };
});