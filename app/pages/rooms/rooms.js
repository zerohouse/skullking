(function () {
    angular.module('app').controller('roomCtrl', roomCtrl);
    /* @ng-inject */
    function roomCtrl($scope, $timeout, $rootScope, $state, popup, $ajax, pop, $interval) {

        $rootScope.user = {};

        $scope.rooms = [];

        $scope.go = function (room) {
            let password;
            if (room.password)
                password = prompt("패스워드를 입력해주세요.");
            if (!$rootScope.user._id) {
                popup.confirm("회원으로 가입하면 게임 전적이 기록되고, 포인트가 쌓입니다.", "비회원으로 진행하시겠습니까?").then(function () {
                    $ajax.get('/api/playerCode', {id: room.id, password: password}).then(player => {
                        $state.go('game', {id: room.id, player: player});
                    });
                });
                return;
            }
            $ajax.get('/api/userPlayerCode', {id: room.id, password: password}).then(player => {
                $state.go('game', {id: room.id, player: player});
            });
        };

        $scope.makeRoomPopup = function () {
            if (!$rootScope.user._id) {
                pop.alert("비회원은 방을 만들 수 없습니다.");
                return;
            }
            popup.open('makeRoom', $scope);
        };

        $scope.makeRoom = function (options) {
            $ajax.post('/api/newRoomCode', options, true).then(code => {
                $state.go('game', {id: code.room, player: code.player});
                popup.close();
            });
        };

        $scope.registerPopup = function () {
            popup.open('register', $scope);
        };

        $scope.register = function (user) {
            $ajax.post('/api/user', user, true).then(function () {
                $rootScope.user = user;
                popup.close();
            });
        };

        $scope.loginPopup = function () {
            popup.open('login', $scope);
        };

        $scope.login = function (user) {
            $ajax.post('/api/user/login', user, true).then(function (res) {
                $rootScope.user = res;
                popup.close();
            });
        };

        $scope.logout = function () {
            $ajax.get('/api/user/logout').then(function () {
                $rootScope.user = {};
            });
        };

        $ajax.get('/api/user').then(function (res) {
            $rootScope.user = res ? res : {};
        });


        $scope.refresh = function () {
            $ajax.get('/api/rooms').then(function (res) {
                $scope.rooms = res;
            });
        };

        $scope.refresh();
        $interval($scope.refresh, 5000);

    }
})();