(function () {
    angular.module('app').controller('coursesCtrl', coursesCtrl);
    /* @ng-inject */
    function coursesCtrl(loading, $ajax, $scope) {

        $ajax.get('/api/v1/course').then(list=> {
            $scope.courses = list;
            loading.done();
        });

    }
})
();