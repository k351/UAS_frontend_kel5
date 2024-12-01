angular.module('revifeApp').controller('CartController', ['$scope', '$http', function($scope, $http) {
    $scope.cartItems = [];
    $scope.cartTotal = 0;
    $scope.couponDiscount = 0;

    $scope.loadCartItems = function() {
        $http.get('/api/cart/populate')
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


    $scope.updateQuantity = function(cartItemId, newQuantity) {
        $http.put(`/api/cart/update/${cartItemId}`, { cartQuantity: newQuantity })
            .then(function() {
                $scope.loadCartItems();
            })
            .catch(function(error) {
                console.error('Error updating quantity:', error);
            });
    };

    $scope.removeItem = function(cartItemId) {
        $http.delete(`/api/cart/delete/${cartItemId}`)
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

    $scope.applyCoupon = function(couponCode) {

        if (!couponCode) {
            console.error('Invalid coupon code.');
            $scope.couponDiscount = 0;
            return;
        }

        $http.get(`/api/coupons/${couponCode}`)
            .then(function(response) {
                const coupon = response.data;
            
            if (coupon) {
                if (coupon.discountType === "fixed") {
                    $scope.couponDiscount = coupon.discountValue;
                }
                else if (coupon.discountType === "percentage") {
                    $scope.couponDiscount = (coupon.discountValue / 100) * $scope.cartTotal;
                }
                else {
                    console.error(coupon.discountType);
                    $scope.couponDiscount = 0;
                }
                alert("Coupon Succesfully Added")
            } else {
                console.error('Coupon not found.');
                $scope.couponDiscount = 0;
                $scope.finalPrice = $scope.cartTotal;
            }
        })
        .catch(function(error) {
            console.error('Error loading coupon:', error);
            $scope.couponDiscount = 0;
            $scope.finalPrice = $scope.cartTotal;
        });
    };


    $scope.loadCartItems();
}]);
