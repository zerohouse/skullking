(function () {
    angular.module('app').directive('reply', reply);
    /* @ng-inject */
    function reply() {
        return {
            restrict: 'E',
            templateUrl: '/directive/replies/reply/reply.html',
            scope: {
                reply: '=',
                replies: '=',
                title: '='
            },
            controller: function ($scope, popup, pop, $ajax, $rootScope, construct, $timeout) {

                $scope.isRootUser = ()=> {
                    return $scope.reply.user.id === $rootScope.user.id;
                };

                $scope.modifying = function () {
                    $scope.reply.modify = true;
                };

                $scope.delete = function () {
                    popup.confirm($scope.title +
                        "을 삭제하시겠습니까?", "삭제확인").then(()=> {
                        $ajax.delete('/api/v1/reply', {id: $scope.reply.id}).then(()=> {
                            pop.alert($scope.title +
                                "이 삭제되었습니다.");
                            $scope.replies.remove($scope.reply);
                        });
                    });
                };

                $scope.report = function () {
                    popup.confirm($scope.title +
                        "을 신고하시겠습니까?", "확인").then(()=> {
                        $ajax.post('/api/v1/reply/report', {id: $scope.reply.id}).then(()=> {
                            pop.alert($scope.title +
                                "이 신고되었습니다.");
                        });
                    });
                };

                $scope.done = function () {
                    var params = {};
                    params.text = $scope.reply.text;
                    params.id = $scope.reply.id;
                    params.type = $scope.reply.type;
                    params.parentId = $scope.reply.parentId;
                    $ajax.post('/api/v1/reply', params, true).then(reply=> {
                        if ($scope.reply.mode) {
                            $scope.replies.forEach(reply=> {
                                reply.new = false;
                            });
                            $scope.reply.new = true;
                            pop.alert($scope.title +
                                "이 작성되었습니다.");
                            $scope.reply.modify = false;
                            $timeout(()=> {
                                construct.reply(reply);
                                angular.copy(reply, $scope.reply);
                            });
                            return;
                        }
                        pop.alert($scope.title +
                            "이 수정되었습니다.");
                        construct.reply(reply);
                        angular.copy(reply, $scope.reply);
                        $scope.reply.modify = false;
                    });
                };

                $scope.cancel = ()=> {
                    if ($scope.reply.mode) {
                        $scope.replies.remove($scope.reply);
                        return;
                    }
                    $scope.reply.modify = false;
                    $scope.reply.text = $scope.reply.origin;
                };

                $scope.nestedReply = ()=> {
                    $scope.replies.forEach(reply=> {
                        reply.new = false;
                    });
                    $scope.reply.new = true;
                    $scope.replies.pushInto($scope.replies.indexOf($scope.reply) + 1, {
                        modify: true,
                        mode: "답글 달기",
                        parentId: $scope.reply.id,
                        type: $scope.reply.type,
                        user: $rootScope.user
                    });
                    $timeout(()=> {
                        $('body').stop().animate({scrollTop: $('.new').offset().top}, '500', 'swing', function () {
                        });
                    });
                };
            }
        };
    }
})();