angular.module('app').run(function ($rootScope, popup, $ajax, pop) {

    $rootScope.user = {};

    $rootScope.name = function () {
        $rootScope.n = $rootScope.user.name;
        popup.open('name', $rootScope);
    };

    $rootScope.reName = function (name) {
        if (name.length < 2) {
            pop.alert("Name must has at least 2 chars");
            return;
        }
        $ajax.post('/api/user/name', {name: name}, true).then(function () {
            $rootScope.user.name = name;
            $rootScope.close();
        });
    };


    $rootScope.registerPopup = function () {
        popup.open('register', $rootScope);
    };

    $rootScope.register = function (user) {
        $ajax.post('/api/user', user, true).then(function (user) {
            $rootScope.user = user;
            popup.close();
        });
    };

    $rootScope.loginPopup = function () {
        popup.open('login', $rootScope);
    };

    $rootScope.login = function (user) {
        $ajax.post('/api/user/login', user, true).then(function (res) {
            $rootScope.user = res;
            popup.close();
        });
    };

    $rootScope.logout = function () {
        $ajax.get('/api/user/logout').then(function () {
            $rootScope.user = {};
        });
    };

    $ajax.get('/api/user').then(function (res) {
        $rootScope.user = res ? res : {};
    });

});