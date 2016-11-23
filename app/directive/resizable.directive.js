angular.module('app').directive("resizable", function () {
    return {
        restrict: 'A',
        link: function (scope, el, attr) {
            $(el).resizable({minHeight: attr.minHeight, handles: attr.resizable});
        }
    };
});