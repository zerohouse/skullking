(function () {
    angular.module('app').controller('roomCtrl', roomCtrl);
    /* @ng-inject */
    function roomCtrl($scope, $rootScope, $state, popup, $ajax, pop, $interval) {

        $scope.cards = [{
            "type": {"name": "red", "red": true, "normal": true},
            "name": "red",
            "src": "/images/cards/red12.jpg",
            "no": 13,
            "id": 48
        }, {
            "type": {"name": "blue", "blue": true, "normal": true},
            "name": "blue",
            "src": "/images/cards/blue12.jpg",
            "no": 13,
            "id": 49,
            submitable: true
        }, {
            "type": {"name": "yellow", "yellow": true, "normal": true},
            "name": "yellow",
            "src": "/images/cards/yellow12.jpg",
            "no": 13,
            "id": 50, submitable: true, winable: true
        }, {
            "type": {"name": "black", "black": true, "normal": true},
            "name": "black",
            "src": "/images/cards/black12.jpg",
            "no": 13,
            "id": 51
        }, {
            "type": {"name": "pirate", "pirate": true, "item": true},
            "name": "pirate",
            "src": "/images/cards/pirate4.jpg",
            "no": 0,
            "id": 56,
            submitable: true
        }, {
            "type": {"name": "white", "white": true, "item": true},
            "name": "escape",
            "src": "/images/cards/white0.jpg",
            "no": 0,
            "id": 61,
            submitable: true,
            winable: true
        }, {
            "type": {"name": "girl", "girl": true, "item": true},
            "name": "girl",
            "src": "/images/cards/girl1.jpg",
            "no": 0,
            "id": 63
        }, {
            "type": {"name": "king", "king": true, "item": true},
            "name": "king",
            "src": "/images/cards/king0.jpg",
            "no": 0,
            "id": 64,
            submitable: true
        }, {
            "type": {"name": "pirateOR", "pirateOR": true, "item": true},
            "name": "pirate/escape",
            "src": "/images/cards/pirateOR0.jpg",
            "no": 0,
            "id": 65,
            submitable: true,
            winable: true
        }];

        $rootScope.user = {};

        $scope.rooms = [];

        $scope.go = function (room) {
            let password;
            if (room.password)
                password = prompt("Password?");
            if (!$rootScope.user._id) {
                popup.confirm("When you become a member, you are recorded as a whole and accumulated points.", "Do you wish play game as non-member?").then(function () {
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
                pop.alert("Non-member can't make a new game.");
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
            $ajax.post('/api/user', user, true).then(function (user) {
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

        $scope.refreshRank = function () {
            $ajax.get('/api/ranks').then(function (res) {
                $scope.ranks = res;
                $scope.ranks.forEach(r => {
                    if (r.ranks.length === 0)
                        return;
                    r.avgPoint = r.point / r.ranks.length;
                    r.avgRank = r.ranks.reduce((a, b) => {
                            return a + (b.rank / b.players);
                        }, 0) / r.ranks.length;
                });
            });
        };

        $scope.refreshRank();
    }
})();