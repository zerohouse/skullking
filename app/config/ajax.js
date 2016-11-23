(function () {
    angular.module('app').run(ajaxConfig);
    /* @ng-inject */
    function ajaxConfig($ajax, popup, $state, $rootScope) {
        $ajax.handler((response, success, error)=> {
                if (response.state === "SUCCESS") {
                    success(response.data);
                    return;
                }
                if (response.state === "LOGIN_NEEDED") {
                    $state.go('welcome');
                    $rootScope.loginPopup();
                    return;
                }
                if (response.state === "ERROR") {
                    popup.alert(response.data);
                    error(response);
                    return;
                }
                error(response);
            }
        );
    }
})();