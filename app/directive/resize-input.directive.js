angular.module('app').directive("reSize", function () {
    return {
        link: function (scope, el, attrs) {
            function resizeInput() {
                $(el).css("width", "initial");
                $(el).attr('size', $(el).val().length + $(el).val().length / 9);
            }

            $(el).keyup(resizeInput);
            scope.$watch(attrs.ngModel, resizeInput);
        }
    };
});