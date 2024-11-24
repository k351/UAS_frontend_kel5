angular.module('revifeApp')
    .controller('WishlistController', ['$scope', '$http', function($scope, $http) {
        // Active filters for sorting (removed sorting logic)
        $scope.activeFilters = {};
        
        // Fetch wishlist items from the backend
        $scope.loadWishlistItems = function() {
            $http.get('/api/wishlist')  // Call the backend to get the wishlist
                .then(function(response) {
                    const wishlistItems = response.data;  // The response data is the wishlist
                    
                    // Attach the wishlist products to scope
                    $scope.wishlistItems = wishlistItems;

                    // Handle the empty wishlist case
                    if ($scope.wishlistItems.length === 0) {
                        $scope.emptyWishlistMessage = 'Your wishlist is empty!';
                    } else {
                        $scope.emptyWishlistMessage = '';  // Clear any empty message
                    }

                }, function(error) {
                    console.error('Error fetching wishlist:', error);
                    $scope.emptyWishlistMessage = 'Failed to load wishlist.';
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

        // Initial call to load wishlist items
        $scope.loadWishlistItems();
    }]);
