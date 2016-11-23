(function () {
    angular.module('app').controller('noPageCtrl', noPageCtrl);
    /* @ng-inject */
    function noPageCtrl(loading) {
        loading.done();
    }
})();