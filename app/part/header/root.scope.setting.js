(function () {
    angular.module('app').run(rootScopeSetting);
    /* @ng-inject */
    function rootScopeSetting($rootScope, popup, userService) {

        $rootScope.toggle = selector => {
            $(selector).toggle({});
        };

        $rootScope.loginPopup = ()=> {
            vex.close();
            popup.open('login', 'vex-theme-plain mid center round nonpadding layout-column layout-align-center-center');
        };

        $rootScope.registerPopup = ()=> {
            vex.close();
            popup.open('register', 'vex-theme-plain mid center round nonpadding layout-column layout-align-center-center');
        };

        $rootScope.login = (user, valid) => {
            if (!valid)
                return;
            userService.login(user).then(()=> {
                popup.close();
            });
        };

        $rootScope.errors = form => {
            var result = {};
            angular.forEach(form, (value, key)=> {
                if (key.startsWith("$"))
                    return;
                if (!value.$viewValue)
                    return;
                if (form[key].$valid)
                    return;
                result[key] = true;
            });
            return result;
        };

        $rootScope.register = (user, valid) => {
            if (!valid)
                return;
            userService.register(user).then(()=> {
                popup.close();
            });
        };

        $rootScope.logout = () => {
            userService.logout();
        };

    }
})();