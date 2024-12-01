angular.module('revifeApp').service('CartService', ['$http', function($http) {

    this.getCartItems = function() {
        return $http.get('/api/cart').then(response => response.data);
    };

    this.getCartItemsPopulate = function() {
        return $http.get('/api/cart/populate');
    };

    this.addToCart = function(productId, quantity) {
        return $http.post('/api/cart/add', {
            productId: productId,
            cartQuantity: quantity
        });
    };

    this.updateQuantity = function(cartItemId, newQuantity) {
        return $http.put(`/api/cart/update/${cartItemId}`, { cartQuantity: newQuantity });
    };

    this.removeItem = function(cartItemId) {
        return $http.delete(`/api/cart/delete/${cartItemId}`);
    };
}]);


angular.module('revifeApp').controller('CartController', ['$scope', 'CartService', function($scope, CartService) {
    $scope.cartItems = [];
    $scope.cartTotal = 0;

    $scope.loadCartItems = function() {
        CartService.getCartItemsPopulate()
            .then(function(response) {
                $scope.cartItems = response.data.map(function(cartItem) {
                    return { 
                        id: cartItem._id,
                        name: cartItem.productId.name,
                        price: cartItem.productId.price,
                        image: cartItem.productId.image,
                        cartQuantity: cartItem.cartQuantity
                    };
                });
                $scope.calculateCartTotal();
            })
            .catch(function(error) {
                console.error('Error loading cart items:', error);
            });
    };


    $scope.addToCart = function(productId, quantity) {
        CartService.addToCart(productId, quantity)
            .then(function() {
                alert('Item added to cart successfully!');
                $scope.loadCartItems();
            })
            .catch(function(error) {
                console.error('Error adding to cart:', error);
                alert('Failed to add item to cart.');
            });
    };

    $scope.updateQuantity = function(cartItemId, newQuantity) {
        CartService.updateQuantity(cartItemId, newQuantity)
            .then(function() {
                $scope.loadCartItems();
            })
            .catch(function(error) {
                console.error('Error updating quantity:', error);
            });
    };

    $scope.removeItem = function(cartItemId) {
        CartService.removeItem(cartItemId)
            .then(function() {
                $scope.loadCartItems();
            })
            .catch(function(error) {
                console.error('Error removing item:', error);
            });
    };

    $scope.calculateCartTotal = function() {
        let total = 0;
        $scope.cartItems.forEach(function(item) {
            total += item.cartQuantity * item.price;
        });
        $scope.cartTotal = total;
    };

    $scope.loadCartItems();
}]);
