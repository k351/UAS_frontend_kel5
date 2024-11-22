// Cart Service
angular.module('revifeApp.services', [])
.service('CartService', ['$http', function($http) {
    this.getCartItems = function() {
        return $http.get('/api/cart-items');
    };

    this.updateQuantity = function(itemName, newQuantity) {
        return $http.put('/api/cart-items/update', {
            name: itemName, 
            quantity: newQuantity
        });
    };

    this.removeItem = function(itemName) {
        return $http.delete(`/api/cart-items/${itemName}`);
    };

    this.applyCoupon = function(couponCode) {
        return $http.post('/api/apply-coupon', { code: couponCode });
    };

    this.calculateCartTotal = function() {
        return $http.get('/api/cart-total');
    };
}])

// Cart Controller
.controller('CartController', ['$scope', 'CartService', function($scope, CartService) {
    $scope.cartItems = [];
    $scope.couponDiscount = 0;
    $scope.cartTotal = 0;
    $scope.isCheckoutButtonVisible = false;

    // Load Cart Items
    $scope.loadCartItems = function() {
        CartService.getCartItems()
            .then(function(response) {
                $scope.cartItems = response.data;
                $scope.isCheckoutButtonVisible = $scope.cartItems.length > 0;
                $scope.updateCartTotal();
            })
            .catch(function(error) {
                console.error('Error loading cart items:', error);
            });
    };

    // Update Item Quantity
    $scope.updateQuantity = function(itemName, newQuantity) {
        CartService.updateQuantity(itemName, newQuantity)
            .then(function() {
                $scope.loadCartItems();
            })
            .catch(function(error) {
                console.error('Error updating quantity:', error);
            });
    };

    // Remove Item
    $scope.removeItem = function(itemName) {
        CartService.removeItem(itemName)
            .then(function() {
                $scope.loadCartItems();
            })
            .catch(function(error) {
                console.error('Error removing item:', error);
            });
    };

    // Update Cart Total
    $scope.updateCartTotal = function() {
        CartService.calculateCartTotal()
            .then(function(response) {
                $scope.cartTotal = response.data.total;
                $scope.couponDiscount = response.data.discount;
            })
            .catch(function(error) {
                console.error('Error calculating total:', error);
            });
    };

    // Apply Coupon
    $scope.applyCoupon = function() {
        const couponCode = $scope.couponCode.trim().toUpperCase();
        
        if ($scope.cartItems.length === 0) {
            alert('Please add items to cart before applying a coupon.');
            return;
        }

        CartService.applyCoupon(couponCode)
            .then(function(response) {
                if (response.data.success) {
                    alert(`Coupon applied! You saved Rp ${response.data.discount}.`);
                    $scope.updateCartTotal();
                } else {
                    alert('Invalid coupon code.');
                }
            })
            .catch(function(error) {
                console.error('Error applying coupon:', error);
                alert('Failed to apply coupon.');
            });
    };

    // Initialize on controller load
    $scope.loadCartItems();
}]);