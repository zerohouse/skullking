(function () {
    angular.module('app').directive('like', like);
    /* @ng-inject */
    function like() {
        return {
            restrict: 'E',
            scope: {
                likes: '=',
                type: '@',
                likeId: '='
            },
            templateUrl: '/directive/like/like.html',
            controller: function ($ajax, $scope, $rootScope) {
                $scope.like = function () {
                    $ajax.get("/api/v1/like", {type: $scope.type, id: $scope.likeId}).then(added=> {
                        if (added)
                            $scope.likes.push($rootScope.user.id);
                        else
                            $scope.likes.remove($rootScope.user.id);
                    });
                };
                $scope.isRootUser = ()=> {
                    if (!$scope.likes)
                        return false;
                    return $scope.likes.contains($rootScope.user.id);
                };
            }
        };
    }
})();