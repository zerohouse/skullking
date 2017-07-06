(function () {
    angular.module('app').service('pop', pop);
    /* @ng-inject */
    function pop(toastr) {
        this.success = message => {
            makeToastr("success", message);
        };

        this.alert = message => {
            makeToastr("info", message);
        };

        this.error = message => {
            makeToastr("error", message);
            throw message;
        };

        function makeToastr(type, message) {
            toastr[type](message);
        }
    }
})();