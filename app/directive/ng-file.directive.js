/* @ng-inject */
angular.module('app').directive("ngFile", function ($parse, $q) {

    File.prototype.getString = function () {
        return $q((ok)=> {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                ok(e.target.result);
            };
            fileReader.readAsText(this);
        });
    };

    return {
        link: function (scope, el, attrs) {
            el.bind("change", function (e) {
                var model = $parse(attrs.ngFile);
                model.assign(scope, (e.srcElement || e.target).files[0]);
                if (attrs.onFileChange) {
                    scope.$eval(attrs.onFileChange);
                    if (!scope.$$phase)
                        scope.$apply();
                }
            });
        }
    };
});