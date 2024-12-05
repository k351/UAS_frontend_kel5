angular.module('revifeApp').controller('WishlistController', ['$scope', '$http', function($scope, $http) {
    // Active filters for sorting (removed sorting logic)
    $scope.activeFilters = {};
    $scope.wishlistState = {};  

    $scope.loadWishlistItems = function() {
        $http.get('/api/wishlist')  
            .then(function(response) {
                const wishlistItems = response.data || [];  // Ensure it's an array
                $scope.wishlistItems = wishlistItems;
    
                if (Array.isArray(wishlistItems)) {
                    wishlistItems.forEach(product => {
                        $scope.wishlistState[product._id] = true; // Mark product as in wishlist
                    });
    
                    if ($scope.wishlistItems.length === 0) {
                        $scope.emptyWishlistMessage = 'Your wishlist is empty!';
                    } else {
                        $scope.emptyWishlistMessage = '';  // Clear any empty message
                    }
                } else {
                    console.error('Response data is not an array:', wishlistItems);
                    $scope.emptyWishlistMessage = 'Failed to load wishlist.';
                }
            }, function(error) {
                console.error('Error fetching wishlist:', error);
                $scope.emptyWishlistMessage = 'Failed to load wishlist.';
            });
    };

    // Toggle wishlist (add/remove)
    $scope.toggleWishlist = function (product) {
        const action = $scope.wishlistState[product._id] ? 'DELETE' : 'POST';  
        // Make the appropriate request
        $http({
            method: action === 'POST' ? 'POST' : 'DELETE',
            url: '/api/wishlist',
            headers: {
                'Content-Type': 'application/json' // Ensures the request is sent as JSON
            },
            data: { productId: product._id }
        }).then(function(response) {
            if (action === 'POST') {
                $scope.wishlistState[product._id] = true;  // Mark as added
                alert('Item added to wishlist');
            }
            else  {
                $scope.wishlistState[product._id] = false;  // Mark as removed
                alert('Item deleted to wishlist');
            }
        }).catch(function(error) {
            console.error('Error updating wishlist:', error);
        });
    };

    // Toggle filter for sorting
    $scope.toggleFilter = function (filterName) {
        if ($scope.activeFilters[filterName]) {
            $scope.activeFilters[filterName] = false;
        } else {
            $scope.activeFilters[filterName] = true;
        }
    };

    // Check if the filter is active
    $scope.isFilterActive = function (filterName) {
        return $scope.activeFilters[filterName] || false;
    };

    $scope.isInWishlist = function(product) {
        return $scope.wishlistItems.some(item => item._id === product._id);  // Check if the product's ID exists in the wishlist
    };

    // Initial call to load wishlist items
    $scope.loadWishlistItems();
}]);
