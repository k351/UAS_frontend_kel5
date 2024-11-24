angular.module('revifeApp.controllers')
    .controller('WishlistController', ['$scope', function($scope) {
    $scope.activeFilters = {};

        $scope.toggleFilter = function (filterName) {
            // Toggle the filter's active state
            if ($scope.activeFilters[filterName]) {
                $scope.activeFilters[filterName] = false;
            } else {
                $scope.activeFilters[filterName] = true;
            }
        };

        $scope.isFilterActive = function (filterName) {
            return $scope.activeFilters[filterName] || false;
        };
    }]);
