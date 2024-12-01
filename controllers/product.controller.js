angular.module('revifeApp').controller('ProductController', ['$scope', '$http', function ($scope, $http) {
    $scope.product = {};

    $scope.getProductById = function () {
        $http.get(`/api/products/${id}`).then(function (response) {
            $scope.product = response.data;
        })
    }
}
])