(function () {
    angular.module('app').controller('repliesCtrl', repliesCtrl);
    /* @ng-inject */
    function repliesCtrl($scope, $ajax, pop, construct, $timeout) {

        $scope.getReplies = function () {
            if ($scope.repliesId === undefined)
                return;
            $ajax.get('/api/v1/reply', {type: $scope.type, id: $scope.repliesId}).then(replies=> {
                replies.sort((o1, o2)=> o2.id - o1.id);
                replies.forEach(reply=> construct.reply(reply));
                var childes = replies.filter(reply=>reply.parentId);
                replies.removeAll(childes);
                var result = [];
                replies.forEach(reply=> {
                    result.push(reply);
                    result.pushAll(childes.filter(child=>child.parentId === reply.id));
                });
                $scope.replies = result;
            });
        };

        $scope.$watch('repliesId', $scope.getReplies);

        $scope.preview = true;

        $scope.replies = [];
        $scope.reply = {};

        if (!$scope.title)
            $scope.title = "댓글";

        $scope.done = ()=> {
            if (!$scope.reply.text)
                return;
            var params = {};
            params.type = $scope.type + "_" + $scope.repliesId;
            params.text = $scope.reply.text;
            params.id = $scope.reply.id;
            $ajax.post('/api/v1/reply', params, true).then(reply=> {
                pop.alert("댓글이 작성되었습니다.");
                $scope.replies.forEach(reply=> {
                    reply.new = false;
                });
                construct.reply(reply);
                reply.new = true;
                $scope.write = false;
                $scope.replies.unshift(reply);
                $scope.reply = {};
                $timeout(()=> {
                    $('body').stop().animate({scrollTop: $('.new').offset().top}, '500', 'swing', function () {
                    });
                });// TO 댓글
            });
        };

        $scope.limit = 0;

        $scope.more = ()=> {
            $scope.limit += 8;
        };

        $scope.more();

    }
})();