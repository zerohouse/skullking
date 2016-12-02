(function () {
    angular.module('app').controller('gameCtrl', gameCtrl);
    /* @ng-inject */
    /* Controllers */
    function gameCtrl($scope, $rootScope, popup, ChatSocket, $timeout, pop, $stateParams, logs) {

        $scope.openAvartar = function () {
            popup.open('/dialog/avartar.html', '', $scope);
        };

        function alertAndLog(message, type) {
            popup.alert(message);
            logs.new(message, type);
        }

        $scope.selectAvartar = function (index) {
            ChatSocket.emit("user", {
                avartar: index
            });
            popup.close();
        };

        $scope.images = [
            '/images/0.jpg',
            '/images/1.jpg',
            '/images/2.png',
            '/images/3.jpg',
            '/images/4.jpg',
            '/images/5.png',
            '/images/6.jpg',
            '/images/7.jpg',
            '/images/8.png',
            '/images/9.jpg'
        ];

        $scope.$watch(function () {
            return $stateParams.id;
        }, function (id) {
            if (!id)
                return;
            ChatSocket.emit('join', {id: id});
        });

        $scope.start = function () {
            ChatSocket.emit("start");
        };

        $scope.reset = function () {
            ChatSocket.emit("reset", {password: prompt("종료?")});
        };

        $scope.vote = function (vote) {
            var word = vote ? "찬성" : "반대";
            popup.confirm(word + " 투표한다.").then(function () {
                $scope.votingDone = true;
                ChatSocket.emit("vote", {vote: vote});
            });
        };

        $scope.mission = function (vote) {
            if (($scope.player.state === "merlin" || $scope.player.state === "percival" || !$scope.player.state) && !vote) {
                pop.alert("선의 세력은 실패를 낼 수 없습니다.");
                return;
            }
            var word = vote ? "성공" : "실패";
            popup.confirm(word + "시킨다.").then(function () {
                ChatSocket.emit("mission", {mission: vote});
                $scope.missioningDone = true;
            });
        };

        $scope.$watch('name', function (name) {
            ChatSocket.emit("user", {name: name});
        });

        $scope.changeCard = function (charactor) {
            if ($scope.game.playing)
                return;
            ChatSocket.emit("change", {char: charactor});
        };

        $scope.showState = function () {
            popup.confirm("정체를 확인합니다").then(function () {
                popup.open('/dialog/state.html', '', $scope);
            });
        };


        ChatSocket.on("over", function () {
            popup.alert("인원 초과입니다.");
        });

        ChatSocket.on("start", function () {
            popup.open('/dialog/state.html', '', $scope);
        });


        $scope.players = [];
        $scope.player = {};

        ChatSocket.on("player", function (player) {
            angular.copy(player, $scope.player);
            apply();
        });

        ChatSocket.on("voteStart", function () {
            popup.alert("이 멤버로 투표시작한다.");
            logs.new("원정대 후보 : " + $scope.players.filter(p=>p.select).map(p=> {
                    if (p.name)
                        return p.name;
                    return "플레이어" + ($scope.players.indexOf(p) + 1);
                }).join(", "), "투표 시작");
            $scope.votingDone = false;
            $scope.game.voting = true;
            $scope.player.king = false;
            apply();
        });

        ChatSocket.on("missionStart", function () {
            logs.new("원정대 : " + $scope.players.filter(p=>p.select).map(p=> {
                    if (p.name)
                        return p.name;
                    return "플레이어" + ($scope.players.indexOf(p) + 1);
                }).join(", "), "미션 시작");
            $scope.missioningDone = false;
            $scope.game.missioning = true;
            apply();
        });

        ChatSocket.on("voteResult", function (data) {
            $scope.game.voting = false;
            if (data.agree > data.disagree) {
                alertAndLog("찬성:" + data.agree + ", 반대:" + data.disagree + "로 가결되었습니다.", "투표 결과");
                return;
            }
            alertAndLog("찬성:" + data.agree + ", 반대:" + data.disagree + "로 부결되었습니다.", "투표 결과");
        });

        ChatSocket.on("missionResult", function (data) {
            $scope.game.missioning = false;
            if (data.result)
                alertAndLog("미션 성공하였습니다.", "미션 결과");
            else
                alertAndLog("실패:" + data.fails + "개로 실패하였습니다.", "미션 결과");
        });

        ChatSocket.on("id", function (data) {
            $scope.id = data.id;
        });

        ChatSocket.on("reset", function () {
            location.reload();
        });

        ChatSocket.on("players", function (users) {
            ChatSocket.emit('player');
            angular.copy(users, $scope.players);
            apply();
        });

        ChatSocket.on("game", function (game) {
            angular.copy(game, $scope.game);
            apply();
        });

        ChatSocket.on("evilWins", function (data) {
            if (data.type === 'vote')
                alertAndLog("투표가 5번 부결되어 악의 세력이 승리하였습니다.", "게임 종료");
            else if (data.type === 'merlin')
                alertAndLog("멀린이 암살되어 악의 세력이 승리하였습니다.", "게임 종료");
            else
                alertAndLog("미션에 실패하여 악의 세력이 승리하였습니다.", "게임 종료");
        });

        ChatSocket.on("goodWins", function () {
            alertAndLog("선의 세력이 승리하였습니다.", "게임 종료");
        });

        ChatSocket.on("missionSuccess", function () {
            alertAndLog("미션에 성공하였습니다. 암살자는 멀린을 찾습니다.", "미션 성공");
        });

        $scope.game = {};


        function apply() {
            $timeout(function () {
                if (!$rootScope.$$phase)
                    $rootScope.$apply();
            });
        }

    }
})();