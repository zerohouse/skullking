(function () {
    angular.module('app').controller('roomCtrl', roomCtrl);
    /* @ng-inject */
    function roomCtrl($scope, ChatSocket, $timeout, $rootScope, $state, popup, $ajax, pop) {

        $scope.rooms = [];

        ChatSocket.on("rooms", function (rooms) {
            angular.copy(rooms, $scope.rooms);
            apply();
        });

        $scope.go = function (id) {
            if (!$rootScope.user._id) {
                popup.confirm("회원으로 가입하면 게임 전적이 기록되고, 포인트가 쌓입니다.", "비회원으로 진행하시겠습니까?").then(function () {
                    $ajax.get('/api/playerCode', {id: id}).then(player => {
                        var url = $state.href('game', {id: id, player: player});
                        window.open(url, '_blank');
                    });
                });
                return;
            }
            $ajax.get('/api/userPlayerCode', {id: id}).then(player => {
                var url = $state.href('game', {id: id, player: player});
                window.open(url, '_blank');
            });
        };

        $scope.makeRoom = function () {
            if (!$rootScope.user._id) {
                pop.alert("비회원은 방을 만들 수 없습니다.");
                return;
            }
            $ajax.get('/api/newRoomCode').then(code => {
                var url = $state.href('game', {id: code.room, player: code.player});
                window.open(url, '_blank');
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

        function apply() {
            $timeout(function () {
                if (!$rootScope.$$phase)
                    $rootScope.$apply();
            });
        }
    }
})();