(function () {
    angular.module('app').service('userService', userService);
    /* @ng-inject */
    function userService($ajax, $q, pop, $rootScope, $state) {

        $rootScope.user = {};

        this.isEmailUsable = (data)=> {
            return $q((ok, no)=> {
                $ajax.get('/api/v1/user/checkEmail', {email: data}).then(ok, no);
            });
        };

        this.set = (data)=> {
            angular.copy(data, $rootScope.user);
            $rootScope.user.level = levelService.getLevel($rootScope.user.exp);
            $rootScope.$broadcast("userStateChange");
            if(!data || !data.id){
                $state.go('welcome');
                $rootScope.loginPopup();
            }
        };

        this.register = (data)=> {
            return $q((ok, no)=> {
                $ajax.post('/api/v1/user', data, true).then(response=> {
                    ok(response);
                }, no);
            });
        };

        this.login = (data)=> {
            return $q((ok, no)=> {
                $ajax.post('/api/v1/user/login', data, true).then(response=> {
                    this.set(response);
                    // $state.go('play');
                    ok(response);
                }, no);
            });
        };

        this.update = (user)=> {
            return $q((ok, no)=> {
                $ajax.put('/api/v1/user', user, true).then(response=> {
                    this.set(response);
                    pop.alert('정보가 수정되었습니다.');
                    ok(response);
                }, no);
            });
        };


        this.logout = ()=> {
            $ajax.get('/api/v1/user/logout').then(()=> {
                this.set({});
            });
        };

        this.refresh = ()=> {
            return $q((ok, no)=> {
                $ajax.get('/api/v1/user').then((response)=> {
                    this.set(response);
                    ok();
                }, no);
            });
        };
    }

    angular.module('app').run(LoggedCheck);
    /* @ng-inject */
    function LoggedCheck(userService) {
        userService.refresh();
    }
})();