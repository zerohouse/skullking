(function () {
    angular.module('app').controller('roomCtrl', roomCtrl);
    /* @ng-inject */
    function roomCtrl($scope, ChatSocket, $timeout, $rootScope, $state) {

        $scope.rooms = [];

        ChatSocket.on("rooms", function (rooms) {
            angular.copy(rooms, $scope.rooms);
            apply();
        });

        $scope.go = function (id) {
            var url = $state.href('game', {id: id});
            window.open(url, '_blank');
        };

        function apply() {
            $timeout(function () {
                if (!$rootScope.$$phase)
                    $rootScope.$apply();
            });
        }
    }
})();