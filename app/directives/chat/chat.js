(function () {
    angular.module('app').directive('chat', chat);
    /* @ng-inject */
    function chat() {
        return {
            restrict: 'E',
            templateUrl: '/directives/chat/chat.html',
            controller: function ($scope, ChatSocket, $timeout, logs) {
                $scope.showLog = function (log) {
                    $scope.log = log;
                    $scope.chatShow = true;
                    if (log)
                        $scope.newLog = false;
                    else
                        $scope.newChat = false;
                };

                $scope.messages = [];
                $scope.logs = logs;
                $scope.chatShow = false;

                $scope.send = function (message) {
                    if (!message)
                        return;
                    $scope.messages.push({message: message, me: true});
                    ChatSocket.emit("chat", {message: message});
                    $scope.message = '';
                    scrollAdjust();
                };

                ChatSocket.on("chat", function (message) {
                    if (!$scope.chatShow || $scope.log)
                        $scope.newChat = true;
                    $scope.messages.push(message);
                    if (!$scope.$$phase)
                        $scope.$apply();
                    scrollAdjust();
                });


                logs.new = function (message, type) {
                    if (!$scope.chatShow || !$scope.log)
                        $scope.newLog = true;
                    logs.push({type: type + " >> " +message});
                    scrollAdjust();
                };

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