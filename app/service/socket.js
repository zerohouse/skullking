'use strict';

/* Services */
angular.module('app')
    .factory('ChatSocket', function () {
        return io.connect('/ws');
    });