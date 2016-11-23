(function () {
    var message = {};
    angular.module('app').controller('confirmCtrl', confirmCtrl);
    /* @ng-inject */
    function confirmCtrl($scope, popup) {
        $scope.message = message;
        $scope.ok = ()=> {
            message.ok();
            popup.close();
        };
        $scope.no = ()=> {
            message.no();
            popup.close();
        };
    }

    angular.module('app').service('popup', popupService);
    /* @ng-inject */
    function popupService($compile, $rootScope, $q) {

        this.alert = (message, classes)=> {
            vex.defaultOptions.className = 'vex-theme-os';
            if (!classes || !classes.match('theme'))
                classes = 'vex-theme-wireframe ' + classes;
            vex.dialog.alert({
                message: message,
                className: classes
            });
        };

        this.confirm = (m, title)=> {
            return $q((ok, no)=> {
                message.message = m;
                message.title = title;
                message.ok = ok;
                message.no = no;
                this.open("confirm", "vex-theme-plain");
            });
        };

        this.error = (message, classes)=> {
            this.alert(message, classes);
            throw message;
        };

        this.open = function (template, classes, scope, afterclose) { //TODO scope종료될떄는 생각좀 해야함 destroy
            if (!template.match("html")) {
                template = "/dialog/" + template + ".html";
            }
            var $vexContent, beforeClose;
            var options = $.extend({}, vex.defaultOptions, vex.dialog.defaultOptions, options);
            if (!classes || !classes.match('theme'))
                classes = 'vex-theme-wireframe ' + classes;
            options.className = classes;
            options.afterClose = afterclose;
            if (!scope)
                scope = $rootScope;
            options.content = $compile("<form class='vex-dialog-form' ng-include=\"'" + template + "'\" ></form>")(scope);
            beforeClose = options.beforeClose;
            $vexContent = vex.open(options);
            if (options.focusFirstInput) {
                $vexContent.find('button[type="submit"], button[type="button"], input[type="submit"], input[type="button"], textarea, input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="email"], input[type="month"], input[type="number"], input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="time"], input[type="url"], input[type="week"]').first().focus();
            }
            return $vexContent;
        };

        this.close = function (non) {
            if (non===true)
                closing();
            else
                vex.close(non);
        };

        $rootScope.close = this.close;

        function closing() {
            var $lastVex;
            $lastVex = vex.getAllVexes().last();
            if (!$lastVex.length) {
                return false;
            }
            var id = $lastVex.data().vex.id;
            var $vex, $vexContent, close, options;
            $vexContent = vex.getVexByID(id);
            if (!$vexContent.length) {
                return;
            }
            $vex = $vexContent.data().vex.$vex;
            options = $.extend({}, $vexContent.data().vex);
            close = function () {
                $vexContent.trigger('vexClose', options);
                $vex.remove();
                $('body').trigger('vexAfterClose', options);
                if (options.afterClose) {
                    return options.afterClose($vexContent, options);
                }
            };
            close();
        }

    }
})();