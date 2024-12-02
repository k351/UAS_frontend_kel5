angular.module('revifeApp').controller('ProductController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.product = {};
    $scope.productId = $routeParams.id;

    $scope.getProductById = function () {
        $http.get(`/api/products/${$scope.productId}`).then(function (response) {
            $scope.product = response.data;
        })
    }

    $scope.getProductById()
}
]);