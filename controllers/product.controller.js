angular.module('revifeApp').controller('ProductController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.product = {};
    $scope.productId = $routeParams.id;

    $scope.getProductById = function () {
        $http.get(`/api/products/${$scope.productId}`).then(function (response) {
            $scope.product = response.data;
        })
    }

    $scope.addToCart = function (product) {
        $http.get('/api/cart')
            .then(function (response) {
                console.log('Cart data: ', response.data)
                const cart = response.data;
                const existingItem = cart.find(item => item.productId === product._id);
                if (existingItem) {
                    $http.put(`/api/cart/update/${existingItem._id}`, {
                        cartQuantity: existingItem.cartQuantity + 1
                    }).then(function () {
                        alert('Item quantity updated in cart!');
                    }).catch(function (error) {
                        console.error('Error updating cart:', error);
                        alert('Failed to update item quantity in cart.');
                    });
                } else {
                    $http.post('/api/cart/add', {
                        productId: product._id,
                        cartQuantity: 1
                    }).then(function () {
                        alert('Item added to cart successfully!');
                    }).catch(function (error) {
                        console.error('Error adding to cart:', error);
                        alert('Failed to add item to cart.');
                    });
                }
            }).catch(function (error) {
                console.error('Error retrieving cart items:', error);
                alert('Failed to retrieve cart items.');
            });
    };

    $scope.getProductById()
}
]);