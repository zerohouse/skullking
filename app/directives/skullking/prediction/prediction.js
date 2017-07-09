(function () {
    angular.module('app').directive('prediction', prediction);
    /* @ng-inject */
    function prediction() {
        return {
            restrict: 'E',
            scope: {
                game: '='
            },
            templateUrl: '/directives/skullking/prediction/prediction.html',
            controller: function ($scope, socket, popup) {
                $scope.getDoneSize = function () {
                    if (!$scope.game)
                        return 0;
                    return $scope.game.players.filter(p => p.prediction).length;
                };

                $scope.predict = function (no) {
                    no = parseInt(no);
                    var plus = no === 0 ? $scope.game.round * 10 : no * 20;
                    var minus = no === 0 ? $scope.game.round * 10 : "예측 실패 라운드 횟수 * 10";
                    popup.confirm(`성공시 ${plus}점 획득 <br> 실패시 ${minus}점 차감`, `${no}승 예측`).then(function () {
                        socket.emit('player', 'predict', no);
                        $scope.prediction = no;
                    });
                };
            }
        };
    }
})();