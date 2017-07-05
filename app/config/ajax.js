(function () {
    angular.module('app').run(ajaxConfig);
    /* @ng-inject */
    function ajaxConfig($ajax, popup) {
        $ajax.handler((response, success, error) => {
                if (response.code) {
                    popup.alert(response.errmsg);
                    error(response);
                    return;
                }
                if (response.errors) {
                    popup.alert(JSON.stringify(response.errors));
                    error(response);
                    return;
                }
                success(response);
            }
        );
    }
})();