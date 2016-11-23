(function () {
    angular.module('app').directive('searchBox', searchBox);
    /* @ng-inject */
    function searchBox() {
        return {
            restrict: 'E',
            templateUrl: '/directive/problem-card-list/search-box/search-box.html',
            scope: {
                query: '='
            },
            controller: function ($scope) {
                if (!$scope.query)
                    $scope.query = {level: -1, keyword: ''};
                $scope.searching = () => {
                    $scope.searchmode = !$scope.searchmode;
                    if ($scope.searhmode)
                        return;
                    $scope.query.level = -1;
                    $scope.query.keyword = '';
                };

                $scope.getIcon = function () {
                    if ($scope.searchmode)
                        return 'clear';
                    return 'search';
                };
            }
        };
    }
})();