(function () {
    var module = angular.module('app');

    var directiveName = "otherClick";

    module.directive(directiveName, ['$document', "$parse", function ($document, $parse) {
        return {
            restrict: 'A',
            link:  function (scope, element, attr) {
                var anyOtherClickFunction = $parse(attr[directiveName]);
                var documentClickHandler = function (event) {
                    var eventOutsideTarget = (element[0] !== event.target) && (0 === element.find(event.target).length);
                    if (eventOutsideTarget) {
                        scope.$apply(function () {
                            anyOtherClickFunction(scope, {});
                        });
                    }
                };

                $document.on("click", documentClickHandler);
                scope.$on("$destroy", function () {
                    $document.off("click", documentClickHandler);
                });
            }
        };
    }]);
})();