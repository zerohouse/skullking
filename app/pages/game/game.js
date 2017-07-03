(function () {
    angular.module('app').controller('gameCtrl', gameCtrl);
    /* @ng-inject */
    /* Controllers */
    function gameCtrl($scope, popup, ChatSocket, $stateParams) {

        $scope.names = {
            prediction: "예측하기",
            submit: "카드 제출"
        };

        $scope.$watch(function () {
            return $stateParams.id;
        }, function (id) {
            if (!id)
                return;
            ChatSocket.emit('join', {id: id, player: $stateParams.player});
        });

        ChatSocket.on("game", function (game) {
            console.log(game);
            $scope.game = game;
            $scope.$apply();
        });

        ChatSocket.on("e", function (error) {
            popup.alert(error);
        });

        $scope.startGame = function () {
            ChatSocket.emit('event', 'startGame');
        };

        $scope.name = function (name) {
            ChatSocket.emit('playerEvent', 'name', name);
        };

        $scope.submit = function (card) {
            var pirate;
            if (card.type.name === 'pirateOR')
                pirate = confirm("해적으로 사용한다(취소시 항복으로 사용)");
            ChatSocket.emit('playerEvent', 'submit', card.id, pirate);
        };
    }
})();