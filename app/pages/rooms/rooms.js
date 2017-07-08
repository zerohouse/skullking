(function () {
    angular.module('app').controller('roomCtrl', roomCtrl);
    /* @ng-inject */
    function roomCtrl($scope, $rootScope, $state, popup, $ajax, pop, $interval) {

        $scope.cards =[{"type":{"name":"red","red":true,"normal":true},"name":"red","src":"/images/cards/red1.jpg","no":1,"id":0},{"type":{"name":"blue","blue":true,"normal":true},"name":"blue","src":"/images/cards/blue1.jpg","no":1,"id":1},{"type":{"name":"yellow","yellow":true,"normal":true},"name":"yellow","src":"/images/cards/yellow1.jpg","no":1,"id":2},{"type":{"name":"black","black":true,"normal":true},"name":"black","src":"/images/cards/black1.jpg","no":1,"id":3},{"type":{"name":"red","red":true,"normal":true},"name":"red","src":"/images/cards/red2.jpg","no":2,"id":4},{"type":{"name":"blue","blue":true,"normal":true},"name":"blue","src":"/images/cards/blue2.jpg","no":2,"id":5},{"type":{"name":"yellow","yellow":true,"normal":true},"name":"yellow","src":"/images/cards/yellow2.jpg","no":2,"id":6},{"type":{"name":"black","black":true,"normal":true},"name":"black","src":"/images/cards/black2.jpg","no":2,"id":7},{"type":{"name":"red","red":true,"normal":true},"name":"red","src":"/images/cards/red3.jpg","no":3,"id":8},{"type":{"name":"blue","blue":true,"normal":true},"name":"blue","src":"/images/cards/blue3.jpg","no":3,"id":9},{"type":{"name":"yellow","yellow":true,"normal":true},"name":"yellow","src":"/images/cards/yellow3.jpg","no":3,"id":10},{"type":{"name":"black","black":true,"normal":true},"name":"black","src":"/images/cards/black3.jpg","no":3,"id":11},{"type":{"name":"red","red":true,"normal":true},"name":"red","src":"/images/cards/red4.jpg","no":4,"id":12},{"type":{"name":"blue","blue":true,"normal":true},"name":"blue","src":"/images/cards/blue4.jpg","no":4,"id":13},{"type":{"name":"yellow","yellow":true,"normal":true},"name":"yellow","src":"/images/cards/yellow4.jpg","no":4,"id":14},{"type":{"name":"black","black":true,"normal":true},"name":"black","src":"/images/cards/black4.jpg","no":4,"id":15},{"type":{"name":"red","red":true,"normal":true},"name":"red","src":"/images/cards/red5.jpg","no":5,"id":16},{"type":{"name":"blue","blue":true,"normal":true},"name":"blue","src":"/images/cards/blue5.jpg","no":5,"id":17},{"type":{"name":"yellow","yellow":true,"normal":true},"name":"yellow","src":"/images/cards/yellow5.jpg","no":5,"id":18},{"type":{"name":"black","black":true,"normal":true},"name":"black","src":"/images/cards/black5.jpg","no":5,"id":19},{"type":{"name":"red","red":true,"normal":true},"name":"red","src":"/images/cards/red6.jpg","no":6,"id":20},{"type":{"name":"blue","blue":true,"normal":true},"name":"blue","src":"/images/cards/blue6.jpg","no":6,"id":21},{"type":{"name":"yellow","yellow":true,"normal":true},"name":"yellow","src":"/images/cards/yellow6.jpg","no":6,"id":22},{"type":{"name":"black","black":true,"normal":true},"name":"black","src":"/images/cards/black6.jpg","no":6,"id":23},{"type":{"name":"red","red":true,"normal":true},"name":"red","src":"/images/cards/red7.jpg","no":7,"id":24},{"type":{"name":"blue","blue":true,"normal":true},"name":"blue","src":"/images/cards/blue7.jpg","no":7,"id":25},{"type":{"name":"yellow","yellow":true,"normal":true},"name":"yellow","src":"/images/cards/yellow7.jpg","no":7,"id":26},{"type":{"name":"black","black":true,"normal":true},"name":"black","src":"/images/cards/black7.jpg","no":7,"id":27},{"type":{"name":"red","red":true,"normal":true},"name":"red","src":"/images/cards/red8.jpg","no":8,"id":28},{"type":{"name":"blue","blue":true,"normal":true},"name":"blue","src":"/images/cards/blue8.jpg","no":8,"id":29},{"type":{"name":"yellow","yellow":true,"normal":true},"name":"yellow","src":"/images/cards/yellow8.jpg","no":8,"id":30},{"type":{"name":"black","black":true,"normal":true},"name":"black","src":"/images/cards/black8.jpg","no":8,"id":31},{"type":{"name":"red","red":true,"normal":true},"name":"red","src":"/images/cards/red9.jpg","no":9,"id":32},{"type":{"name":"blue","blue":true,"normal":true},"name":"blue","src":"/images/cards/blue9.jpg","no":9,"id":33},{"type":{"name":"yellow","yellow":true,"normal":true},"name":"yellow","src":"/images/cards/yellow9.jpg","no":9,"id":34},{"type":{"name":"black","black":true,"normal":true},"name":"black","src":"/images/cards/black9.jpg","no":9,"id":35},{"type":{"name":"red","red":true,"normal":true},"name":"red","src":"/images/cards/red10.jpg","no":10,"id":36},{"type":{"name":"blue","blue":true,"normal":true},"name":"blue","src":"/images/cards/blue10.jpg","no":10,"id":37},{"type":{"name":"yellow","yellow":true,"normal":true},"name":"yellow","src":"/images/cards/yellow10.jpg","no":10,"id":38},{"type":{"name":"black","black":true,"normal":true},"name":"black","src":"/images/cards/black10.jpg","no":10,"id":39},{"type":{"name":"red","red":true,"normal":true},"name":"red","src":"/images/cards/red11.jpg","no":11,"id":40},{"type":{"name":"blue","blue":true,"normal":true},"name":"blue","src":"/images/cards/blue11.jpg","no":11,"id":41},{"type":{"name":"yellow","yellow":true,"normal":true},"name":"yellow","src":"/images/cards/yellow11.jpg","no":11,"id":42},{"type":{"name":"black","black":true,"normal":true},"name":"black","src":"/images/cards/black11.jpg","no":11,"id":43},{"type":{"name":"red","red":true,"normal":true},"name":"red","src":"/images/cards/red12.jpg","no":12,"id":44},{"type":{"name":"blue","blue":true,"normal":true},"name":"blue","src":"/images/cards/blue12.jpg","no":12,"id":45},{"type":{"name":"yellow","yellow":true,"normal":true},"name":"yellow","src":"/images/cards/yellow12.jpg","no":12,"id":46},{"type":{"name":"black","black":true,"normal":true},"name":"black","src":"/images/cards/black12.jpg","no":12,"id":47},{"type":{"name":"red","red":true,"normal":true},"name":"red","src":"/images/cards/red12.jpg","no":13,"id":48},{"type":{"name":"blue","blue":true,"normal":true},"name":"blue","src":"/images/cards/blue12.jpg","no":13,"id":49},{"type":{"name":"yellow","yellow":true,"normal":true},"name":"yellow","src":"/images/cards/yellow12.jpg","no":13,"id":50},{"type":{"name":"black","black":true,"normal":true},"name":"black","src":"/images/cards/black12.jpg","no":13,"id":51},{"type":{"name":"pirate","pirate":true,"item":true},"name":"pirate","src":"/images/cards/pirate0.jpg","no":0,"id":52},{"type":{"name":"pirate","pirate":true,"item":true},"name":"pirate","src":"/images/cards/pirate1.jpg","no":0,"id":53},{"type":{"name":"pirate","pirate":true,"item":true},"name":"pirate","src":"/images/cards/pirate2.jpg","no":0,"id":54},{"type":{"name":"pirate","pirate":true,"item":true},"name":"pirate","src":"/images/cards/pirate3.jpg","no":0,"id":55},{"type":{"name":"pirate","pirate":true,"item":true},"name":"pirate","src":"/images/cards/pirate4.jpg","no":0,"id":56},{"type":{"name":"white","white":true,"item":true},"name":"escape","src":"/images/cards/white0.jpg","no":0,"id":57},{"type":{"name":"white","white":true,"item":true},"name":"escape","src":"/images/cards/white0.jpg","no":0,"id":58},{"type":{"name":"white","white":true,"item":true},"name":"escape","src":"/images/cards/white0.jpg","no":0,"id":59},{"type":{"name":"white","white":true,"item":true},"name":"escape","src":"/images/cards/white0.jpg","no":0,"id":60},{"type":{"name":"white","white":true,"item":true},"name":"escape","src":"/images/cards/white0.jpg","no":0,"id":61},{"type":{"name":"girl","girl":true,"item":true},"name":"girl","src":"/images/cards/girl0.jpg","no":0,"id":62},{"type":{"name":"girl","girl":true,"item":true},"name":"girl","src":"/images/cards/girl1.jpg","no":0,"id":63},{"type":{"name":"king","king":true,"item":true},"name":"king","src":"/images/cards/king0.jpg","no":0,"id":64},{"type":{"name":"pirateOR","pirateOR":true,"item":true},"name":"pirate/escape","src":"/images/cards/pirateOR0.jpg","no":0,"id":65}];

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