var p;
(function () {
    var message = {};
    angular.module('app').controller('confirmCtrl', confirmCtrl);
    /* @ng-inject */
    function confirmCtrl($scope, popup) {
        $scope.message = message;
        $scope.ok = () => {
            message.ok();
            popup.close();
        };
        $scope.no = () => {
            message.no();
            popup.close();
        };
    }

    angular.module('app').service('popup', popupService);
    /* @ng-inject */
    function popupService($compile, $rootScope, $q, ngDialog) {
        this.alert = (message) => {
            $rootScope.messageAlert = message;
            this.open('alert', $rootScope);
        };
        p = this;
        this.confirm = (m, title, okBtn, cancelBtn) => {
            return $q((ok, no) => {
                message.okBtn = okBtn;
                message.cancelBtn = cancelBtn;
                message.message = m;
                message.title = title;
                message.ok = ok;
                message.no = no;
                this.open("confirm");
            });
        };

        this.open = function (template, scope) { //TODO scope종료될떄는 생각좀 해야함 destroy
            if (!template.match("html")) {
                template = "/dialog/" + template + ".html";
            }
            ngDialog.open({
                template: template,
                scope: scope,
                disableAnimation: true
            });
        };

        this.close = function () {
            ngDialog.close();
        };

        $rootScope.close = this.close;
    }
})();