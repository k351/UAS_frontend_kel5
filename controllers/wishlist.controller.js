angular.module('revifeApp').controller('WishlistController', ['$scope', '$http', '$rootScope', '$timeout', function ($scope, $http, $rootScope, $timeout) {
    $scope.activeFilters = {};
    $scope.wishlistState = {};
    $scope.filters = {
        sort: '', 
    };

        $scope.notification = {
        active: false,
        message: '',
        color: '#4caf50',
    };

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

    // Load wishlist items from the API
    $scope.loadWishlistItems = function () {
        const sortParam = $scope.filters.sort ? `?sortBy=${$scope.filters.sort}` : '';

        $http.get(`/api/wishlist${sortParam}`)
            .then(function (response) {
                const wishlistItems = response.data || []; // Ensure it's an array
                $scope.wishlistItems = wishlistItems;

                if (Array.isArray(wishlistItems)) {
                    wishlistItems.forEach(product => {
                        $scope.wishlistState[product._id] = true; // Mark product as in wishlist
                    });

                    $scope.emptyWishlistMessage = wishlistItems.length === 0 ? 'Your wishlist is empty!' : '';
                } else {
                    console.error('Response data is not an array:', wishlistItems);
                    $scope.emptyWishlistMessage = 'Failed to load wishlist.';
                }
            }, function (error) {
                console.error('Error fetching wishlist:', error);
                $scope.emptyWishlistMessage = 'Failed to load wishlist.';
            });
    };

    // Toggle wishlist (add/remove)
    $scope.toggleWishlist = function (product) {
        const action = $scope.wishlistState[product._id] ? 'DELETE' : 'POST';

        $http({
            method: action === 'POST' ? 'POST' : 'DELETE',
            url: '/api/wishlist',
            headers: {
                'Content-Type': 'application/json'
            },
            data: { productId: product._id }
        }).then(function (response) {
            if (action === 'POST') {
                $scope.wishlistState[product._id] = true;
                $scope.showNotification('Item added to wishlist!', '#4caf50');
            } else {
                $scope.wishlistState[product._id] = false;
                $scope.loadWishlistItems(); // Reload items
                $scope.showNotification('Item removed from wishlist!', '#4caf50');
            }
        }).catch(function (error) {
            $scope.showNotification('Error updating wishlist.', '#f44336');
            console.error('Error updating wishlist:', error);
        });
    };

    // Apply sorting to the wishlist
    $scope.sortWishlist = function (criteria) {
        $scope.filters.sort = criteria; 
        $scope.loadWishlistItems(); 
    };

    // Toggle filter section visibility
    $scope.isFilterActive = function (filterName) {
        return !!$scope.activeFilters[filterName];
    };

    $scope.toggleFilter = function (filterName) {
        for (const key in $scope.activeFilters) {
            if (key !== filterName) {
                $scope.activeFilters[key] = false;
            }
        }
        $scope.activeFilters[filterName] = !$scope.activeFilters[filterName];
    };


    // Add item to cart
    $scope.addToCart = function (product) {
        $http.get('/api/cart')
            .then(function (response) {
                const cart = response.data;
                const existingItem = cart.find(item => item.productId === product._id);
                if (existingItem) {
                    $http.put(`/api/cart/update/${existingItem._id}`, {
                        cartQuantity: existingItem.cartQuantity + 1
                    }).then(function () {
                        $scope.showNotification('Item quantity updated in cart!', '#4caf50');
                    }).catch(function (error) {
                        console.error('Error updating cart:', error);
                        $scope.showNotification('Failed to update item quantity in cart.', '#f44336');
                    });
                } else {
                    $http.post('/api/cart/add', {
                        productId: product._id,
                        cartQuantity: 1
                    }).then(function () {
                        $scope.showNotification('Item added to cart successfully!', '#4caf50');
                    }).catch(function (error) {
                        console.error('Error adding to cart:', error);
                        $scope.showNotification('Failed to add item to cart!', '#4caf50');
                    });
                }
            }).catch(function (error) {
                console.error('Error retrieving cart items:', error);
                $scope.showNotification('Failed to retrieve cart items.', '#f44336');
            });
    };

    // Initial call to load wishlist items
    $scope.loadWishlistItems();
}]);
