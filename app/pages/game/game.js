(function () {
    angular.module('app').controller('gameCtrl', gameCtrl);
    /* @ng-inject */
    function gameCtrl($scope, popup, $state) {

        $scope.ifConfirmMove = function () {
            popup.confirm("내 정보를 확인합니다.").then(function () {
                $state.go('game.info');
            })
        }
    }
})();