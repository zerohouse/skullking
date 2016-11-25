(function () {
    angular.module('app').controller('gameCtrl', gameCtrl);
    /* @ng-inject */
    /* Controllers */
    function gameCtrl($scope, $rootScope, popup, ChatSocket, $timeout, pop, $stateParams) {


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
            ChatSocket.emit("name", {name: name});
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
            $scope.votingDone = false;
            $scope.game.voting = true;
            $scope.player.king = false;
            apply();
        });

        ChatSocket.on("missionStart", function () {
            $scope.missioningDone = false;
            $scope.game.missioning = true;
            apply();
        });

        ChatSocket.on("voteResult", function (data) {
            $scope.game.voting = false;
            if (data.agree > data.disagree) {
                popup.alert("찬성:" + data.agree + ", 반대:" + data.disagree + "로 가결되었습니다.");
                return;
            }
            popup.alert("찬성:" + data.agree + ", 반대:" + data.disagree + "로 부결되었습니다.");
        });

        ChatSocket.on("missionResult", function (data) {
            $scope.game.missioning = false;
            if (data.result) {
                popup.alert("실패:" + data.fails + "개로 성공하였습니다.");
                return;
            }
            popup.alert("실패:" + data.fails + "개로 실패하였습니다.");
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

        $scope.game = {};


        function apply() {
            $timeout(function () {
                if (!$rootScope.$$phase)
                    $rootScope.$apply();
            });
        }

    }
})();