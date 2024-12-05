angular.module('revifeApp').controller('CheckoutController', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location) {
    $scope.userAddress = {};
    $scope.isEditingAddress = false;
    $scope.editedAddress = {};  

    // Use existing values from $rootScope  
    $scope.cartItems = $rootScope.cartItems;
    $scope.cartTotal = $rootScope.cartTotal;
    $scope.couponDiscount = $rootScope.couponDiscount || 0;

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
                alert('Address updated successfully!');
            })
            .catch(function(error) {
                console.error('Error updating address:', error);
                alert('Failed to update address.');
            });
    };

    // Cancel editing address
    $scope.cancelEdit = function() {
        $scope.isEditingAddress = false;
        $scope.editedAddress = angular.copy($scope.userAddress);  
    };
    
    $scope.makePayment = function() {
        const checkoutData = {
            address: $scope.userAddress,
            items: $scope.cartItems,
            paymentMethod: $scope.paymentMethod,
            totalAmount: $scope.totalAfterDiscount(),
        };
        $http.post('/api/checkout', checkoutData)
            .then(function (response) {
            alert('Checkout successful!');
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
                    alert('Failed to clear cart, but checkout was successful.');
                });
        })
        .catch(function(error) {
            console.error('Checkout failed:', error);
            alert('Failed to process checkout.');
        });
    };


    // Initialize data
    $scope.loadAddress();  
}]);
