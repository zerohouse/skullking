'use strict';

/* Services */
angular.module('app')
    .factory('colors', function () {
        var colors = {
            black: "#5d4d4d",
            yellow: "#dcc100",
            red: "#da0000",
            blue: "#5365e4"
        };
        return colors;
    });
