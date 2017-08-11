'use strict';

/* Services */
angular.module('app')
    .factory('socket', function (popup, $state, $timeout, pop) {

        const socket = io.connect('/');
        socket.on("err", function (error) {
            popup.close();
            popup.alert(error);
            $state.go('rooms');
            $timeout(function () {
                location.reload();
            }, 1000);
        });

        socket.on("p", function (error) {
            pop.error(error);
        });

        return socket;
    });