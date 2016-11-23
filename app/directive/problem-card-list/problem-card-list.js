(function () {
    angular.module('app').directive('problemCardList', problemCardList);
    /* @ng-inject */
    function problemCardList() {
        return {
            restrict: 'E',
            templateUrl: '/directive/problem-card-list/problem-card-list.html',
            scope: {
                problems: '=',
                itemPerPage: '=?',
                search: '='
            }, controller: function ($scope) {
                $scope.query = {level: -1, keyword: ''};

                function isKeywordMatched(item) {
                    if (!$scope.query.keyword)
                        return true;
                    return item.name.match($scope.query.keyword) || item.description.match($scope.query.keyword) || item.tags.find(tag=>tag.text.match($scope.query.keyword));
                }

                function isLevelMatched(item) {
                    if ($scope.query.level < 0)
                        return true;
                    return item.level === $scope.query.level;
                }

                $scope.filter = function (item) {
                    return isKeywordMatched(item) && isLevelMatched(item);
                };
            }
        };
    }
})();