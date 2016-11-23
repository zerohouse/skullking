(function () {
    angular.module('app').directive('pagination', pagination);
    /* @ng-inject */
    function pagination() {
        return {
            restrict: 'E',
            templateUrl: '/directive/pagination/pagination.html',
            scope: {
                items: '=',
                pageItems: '=',
                filter: '=?',
                query: '=?',
                itemPerPage: '=?',
                showPageLength: '=?'
            },
            controller: 'paginationCtrl'
        };
    }
})();