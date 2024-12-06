angular.module('revifeApp').controller('CheckoutController', ['$scope', '$http', '$rootScope', '$location', '$timeout', function($scope, $http, $rootScope, $location, $timeout) {
    $scope.userAddress = {};
    $scope.isEditingAddress = false;
    $scope.editedAddress = {};  

    // Use existing values from $rootScope  
    $scope.cartItems = $rootScope.cartItems;
    $scope.cartTotal = $rootScope.cartTotal;
    $scope.couponDiscount = $rootScope.couponDiscount || 0;

        $scope.notification = {
        active: false,
        message: '',
        color: '#4caf50',
    };

    // Notification pop up
    $scope.showNotification = function (message, color = '#4caf50') {
        $scope.notification.message = message;
        $scope.notification.color = color;
        $scope.notification.active = true;

        $timeout(function () {
            $scope.notification.active = false;
        }, 3000);
    };

    $scope.hideNotification = function () {
        $scope.notification.active = false;
    };

    // Calculate total after discount
    $scope.totalAfterDiscount = function() {
        return $scope.cartTotal - $scope.couponDiscount;
    };

    // Fetch user address
    $scope.loadAddress = function() {
        $http.get('/api/users/address')
            .then(function(response) {
                $scope.userAddress = response.data;
                $scope.editedAddress = angular.copy($scope.userAddress); 
            })
            .catch(function(error) {
                console.error('Error fetching address:', error);
            });
    };

    // Save updated user address
    $scope.saveAddress = function() {
        $http.put('/api/users/address/update', $scope.editedAddress)
            .then(function() {
                $scope.userAddress = angular.copy($scope.editedAddress);
                $scope.isEditingAddress = false;
                $scope.showNotification('Address updated successfully!', '#4caf50'); 
            })
            .catch(function(error) {
                console.error('Error updating address:', error);
                $scope.showNotification('Failed to update address.', '#f44336');
            });
    };

    // Cancel editing address
    $scope.cancelEdit = function() {
        $scope.isEditingAddress = false;
        $scope.editedAddress = angular.copy($scope.userAddress);  
    };
    
    // Payment logic for checkout
    $scope.makePayment = function() {
        const checkoutData = {
            address: $scope.userAddress,
            items: $scope.cartItems,
            paymentMethod: $scope.paymentMethod,
            totalAmount: $scope.totalAfterDiscount(),
        };
        $http.post('/api/checkout', checkoutData)
            .then(function (response) {
            $scope.showNotification('Checkout successful!', '#4caf50');
            $scope.cartItems = [];
            $rootScope.cartItems = [];
            $rootScope.cartTotal = 0; 
            $scope.couponDiscount = 0;
                
            $http.delete('/api/cart/clear')
                .then(function() {
                    $rootScope.resetCart(); 
                    $location.path('/'); 
                })
                .catch(function(error) {
                    console.error('Error clearing cart:', error);
                    $scope.showNotification('Failed to clear cart, but checkout was successful.', '#f44336');
                });
        })
        .catch(function(error) {
            console.error('Checkout failed:', error);
            $scope.showNotification('Failed to process checkout.', '#f44336');

        });
    };


    // Initialize data
    $scope.loadAddress();  
}]);
