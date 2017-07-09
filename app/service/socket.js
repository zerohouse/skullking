'use strict';

/* Services */
angular.module('app')
    .factory('socket', function () {
        return io.connect('/');
    });