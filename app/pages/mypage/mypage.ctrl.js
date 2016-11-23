(function () {
    angular.module('app').controller('myPageCtrl', myPageCtrl);
    /* @ng-inject */
    function myPageCtrl(loading, types, $scope, $rootScope, $ajax, userService, pop) {
        $scope.languages = types.languages;
        $scope.newUser = {};
        angular.copy($rootScope.user, $scope.newUser);
        $scope.newUser.language = types.languageMap[$rootScope.user.language];
        loading.done();

        $scope.update = function (valid) {
            if (!valid)
                return;
            var param = {};
            param.email = $scope.newUser.email;
            if ($scope.newUser.language)
                param.language = $scope.newUser.language.language;
            param.name = $scope.newUser.name;
            param.password = $scope.newUser.password;
            param.newPassword = $scope.newUser.newPassword;
            $ajax.put('/api/v1/user', param, true).then(user=> {
                angular.copy(user, $scope.newUser);
                userService.set(user);
                $scope.newUser.language = types.languageMap[$rootScope.user.language];
                pop.alert('정보가 수정되었습니다.');
            });
        };
    }
})();