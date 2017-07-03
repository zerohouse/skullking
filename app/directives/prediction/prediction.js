(function () {
    angular.module('app').directive('prediction', prediction);
    /* @ng-inject */
    function prediction() {
        return {
            restrict: 'E',
            scope: {
                game: '='
            },
            templateUrl: '/directives/prediction/prediction.html',
            controller: function ($scope, ChatSocket, pop) {
                $scope.$watch('predictNo', function (no) {
                    if (isNaN(no)) {
                        $scope.desc = "값을 입력해주세요.";
                        $scope.error = true;
                        return;
                    }
                    no = parseInt(no);
                    if (no > $scope.game.round) {
                        $scope.desc = `0~${$scope.game.round} 사이의 값을 입력해주세요.`;
                        $scope.error = true;
                        return;
                    }
                    var plus = no === 0 ? $scope.game.round * 10 : no * 20;
                    var minus = no === 0 ? $scope.game.round * 10 : "예측 실패 라운드 횟수 * 10";
                    $scope.desc = `성공시 ${plus}점 획득 <br> 실패시 ${minus}점 차감`;
                    $scope.error = false;
                });

                $scope.getDoneSize = function () {
                    if (!$scope.game)
                        return 0;
                    return $scope.game.players.filter(p => p.prediction).length;
                };

                $scope.predict = function (no) {
                    if (isNaN(no)) {
                        pop.alert("값을 입력해주세요.");
                        return;
                    }
                    no = parseInt(no);
                    if (no > $scope.game.round) {
                        pop.alert(`0~${$scope.game.round} 사이의 값을 입력해주세요.`);
                        return;
                    }
                    ChatSocket.emit('playerEvent', 'predict', no);
                };
            }
        };
    }
})();