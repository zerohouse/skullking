(function () {
    angular.module('app').directive('state', state);
    /* @ng-inject */
    function state() {
        return {
            restrict: 'E',
            templateUrl: '/directives/state/state.html',
            scope: {players: '=', player: '='},
            controller: function ($scope) {
                $scope.getMerlin = ()=> {
                    var know = [];
                    getName('assasin', know);
                    getName('morgana', know);
                    getName('overon', know);
                    getName('evil', know);
                    getName('evil', know);
                    getName('evil', know);
                    getName('evil', know);
                    getName('evil', know);
                    return "악의 세력은 " + know.join(", ") + "입니다.";
                };

                $scope.getPercival = ()=> {
                    var know = [];
                    getName('merlin', know);
                    getName('morgana', know);
                    if (know.length === 1) {
                        if (know[0].state === 'morgana')
                            return know[0] + "= 모르가나입니다.";
                        return know[0] + "= 멀린입니다.";
                    }
                    return know.join(", ") + "중 한명은 멀린, 한명은 모르가나입니다.";
                };

                $scope.getEvil = ()=> {
                    var know = [];
                    getName('morgana', know);
                    getName('modred', know);
                    getName('assasin', know);
                    getName('evil', know);
                    getName('evil', know);
                    getName('evil', know);
                    getName('evil', know);
                    getName('evil', know);
                    return "악의 세력은 " + know.join(", ") + "입니다.";
                };


                function getName(char, know) {
                    var player = $scope.players.findBy('state', char);
                    if (!player)
                        return;
                    if ($scope.player.id === player.id)
                        return;
                    var ment = ($scope.players.indexOf(player) + 1) + " " + (player.name || "플레이어");
                    know.pushIfNotExist(ment);
                }
            }
        };
    }
})();