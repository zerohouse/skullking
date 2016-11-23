(function () {
    angular.module('app').controller('playCtrl', playCtrl);
    /* @ng-inject */
    function playCtrl($ajax, $scope, loading) {
        $ajax.get("/api/v1/problem/list").then(list=> {
            list.sort((o1, o2)=>  o1.level - o2.level);
            $scope.problems = list;
            loading.done();
        });

    }
})();