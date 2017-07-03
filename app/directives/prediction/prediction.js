(function () {
    angular.module('app').directive('card', card);
    /* @ng-inject */
    function card() {
        return {
            restrict: 'E',
            scope: {
                card: '='
            },
            templateUrl: '/directives/card/card.html',
            controller: function ($scope, colors) {
                $scope.getColor = function (name) {
                    return colors[name];
                };
                $scope.names = {};
                $scope.getName = function (card) {
                    if ($scope.names[card.id])
                        return $scope.names[card.id];
                    $scope.names[card.id] = randomName(card.type.name);
                };

                var typeNames = {
                    soldier: ["루피", "상디", "샹크스", "조로", "프랑키"],
                    girl: ["로빈", "나미", "비비"],
                    king: ["골D로저"],
                    white: ["도망"],
                    soldierOrWhite:["박쥐"]
                };

                function randomName(type) {
                    return typeNames[type].random();
                }
            }
        };
    }
})();