(function () {
    angular.module('app').controller('reportCtrl', reportCtrl);
    /* @ng-inject */
    function reportCtrl(loading) {
        loading.done();
    }
})();