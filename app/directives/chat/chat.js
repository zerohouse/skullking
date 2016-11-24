(function () {
    angular.module('app').directive('chat', chat);
    /* @ng-inject */
    function chat() {
        return {
            restrict: 'E',
            templateUrl: '/directives/chat/chat.html',
            controller: function ($scope, ChatSocket, $timeout) {
                $scope.messages = [];
                $scope.chatShow = false;

                $scope.send = function (message) {
                    if (!message)
                        return;
                    $scope.messages.push({message: message, me: true});
                    ChatSocket.emit("chat", {message: message});
                    $scope.message = '';
                    $timeout(function () {
                        document.getElementById("chat").scrollTop = 9999999999999999;
                    });
                };

                $scope.$watch('chatShow', function () {
                    $scope.new = false;
                    $timeout(function () {
                        document.getElementById("chat").scrollTop = 9999999999999999;
                    });
                });

                ChatSocket.on("chat", function (message) {
                    if (!$scope.chatShow)
                        $scope.new = true;
                    $scope.messages.push(message);
                    if (!$scope.$$phase)
                        $scope.$apply();
                    $timeout(function () {
                        document.getElementById("chat").scrollTop = 9999999999999999;
                    });
                });

            }
        };
    }
})();