(function () {
    angular.module('app').controller('paginationCtrl', paginationCtrl);
    /* @ng-inject */
    function paginationCtrl($scope, $element, $timeout, $stateParams, $state) {
        $timeout(()=> {
            if ($stateParams.page)
                $scope.setPage(parseInt($stateParams.page) - 1);
        });

        if (!$scope.page)
            $scope.page = 0;
        if (!$scope.itemPerPage)
            $scope.itemPerPage = 10;
        if (!$scope.showPageLength)
            $scope.showPageLength = 8;

        $scope.$watch('items', updateFiltered);
        if ($scope.query)
            $scope.$watch(function () {
                return $scope.query;
            }, updateFiltered, true);

        function updateFiltered() {
            if (!$scope.items)
                return;
            $scope.page = 0;
            $scope.filtered = $scope.filter ? $scope.items.filter($scope.filter) : $scope.items;
            $scope.start = 0;
            $scope.pages = ($scope.filtered.length / $scope.itemPerPage) + 1;
            if ($scope.filtered.length > $scope.itemPerPage) {
                $element.show();
            } else {
                $element.hide();
            }
            updateItems();
        }

        function updateItems() {
            if (!$scope.filtered)
                return;
            $scope.pageItems = $scope.filtered.slice($scope.page * $scope.itemPerPage, ($scope.page + 1) * $scope.itemPerPage);
        }

        $scope.setPage = page => {
            $scope.page = page;
            $state.transitionTo('play', {page: page + 1}, {
                location: true,
                inherit: true,
                relative: $state.$current,
                notify: false
            });

            $scope.start = $scope.page - ($scope.showPageLength / 4 + 1);
            if ($scope.start > $scope.pages - $scope.showPageLength)
                $scope.start = $scope.pages - $scope.showPageLength;
            if ($scope.start < 0)
                $scope.start = 0;
            updateItems();
        };

        $scope.isPage = page=> {
            return page === $scope.page;
        };

    }
})();