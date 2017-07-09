(function () {
    angular.module('app').directive('chat', chat);
    /* @ng-inject */
    function chat() {
        return {
            restrict: 'E',
            templateUrl: '/directives/chat/chat.html',
            controller: function ($scope, socket, $timeout) {
                $scope.messages = [];

                $scope.chatToggle = function () {
                    $scope.chatShow = !$scope.chatShow;
                    $scope.newChat = false;
                };

                $scope.send = function (message) {
                    if (!message)
                        return;
                    $scope.messages.push({message: message, me: true});
                    socket.emit("chat", {message: message});
                    $scope.message = '';
                    scrollAdjust();
                };

                socket.on("chat", function (message) {
                    if (!$scope.chatShow || $scope.log)
                        $scope.newChat = true;
                    $scope.messages.push(message);
                    if (!$scope.$$phase)
                        $scope.$apply();
                    scrollAdjust();
                });

                $scope.$on('$destroy', function () {
                    socket.removeAllListeners("chat");
                });

                function scrollAdjust() {
                    var chat = document.getElementById("chat");
                    $timeout(function () {
                        chat.scrollTop = chat.scrollHeight;
                    });
                }
            }
        };
    }
})();