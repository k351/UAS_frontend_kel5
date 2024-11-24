angular.module('revifeApp')
.controller('ShopController', ['$scope', '$http', '$filter', function($scope, $http, $filter) {
    // Initialize products data
    $scope.productsData = [];
    
    // Pagination settings
    $scope.currentPage = 1;
    $scope.itemsPerPage = 4;
    
    // Search and filter
    $scope.searchQuery = '';
    $scope.selectedCategory = 'none';
    
    // Initialize wishlist state
    $scope.wishlistState = JSON.parse(localStorage.getItem('wishlistState')) || {};

    // Initialize products
    $scope.initializeProducts = function() {
        $http.get('/api/products') // Assuming products are fetched from this endpoint
            .then(response => {
                $scope.productsData = response.data;
                
                // Retrieve stored search and filter queries if available
                const storedSearchQuery = localStorage.getItem('searchQuery');
                const storedFilterQuery = localStorage.getItem('filterQuery');
                
                if(storedSearchQuery) {
                    $scope.searchQuery = storedSearchQuery;
                    localStorage.removeItem('searchQuery');
                    $scope.searchProducts();
                } else if(storedFilterQuery && storedFilterQuery !== 'none') {
                    $scope.selectedCategory = storedFilterQuery;
                    localStorage.removeItem('filterQuery');
                    $scope.filterByCategory();
                }
                
                $scope.setupPagination();
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    };

    // Search products by query
    $scope.searchProducts = function() {
        if ($scope.searchQuery) {
            $scope.productsData = $scope.productsData.filter(product =>
                product.name.toLowerCase().includes($scope.searchQuery.toLowerCase())
            );
        }
        $scope.currentPage = 1;  // Reset pagination on search
        $scope.setupPagination();
    };

    // Category filtering
    $scope.filterByCategory = function() {
        if ($scope.selectedCategory === 'none') {
            $scope.initializeProducts(); // Re-fetch all products if no category selected
        } else {
            $scope.productsData = $scope.productsData.filter(product => 
                product.category.toUpperCase() === $scope.selectedCategory.toUpperCase()
            );
        }
        $scope.currentPage = 1;  // Reset pagination
        $scope.setupPagination();
    };

    // Pagination setup
    $scope.setupPagination = function() {
        $scope.totalPages = Math.ceil($scope.productsData.length / $scope.itemsPerPage);
        $scope.pages = [];
        
        for (let i = 1; i <= $scope.totalPages; i++) {
            $scope.pages.push(i);
        }
        
        $scope.paginatedProducts = $scope.getPaginatedProducts();
    };
    
    // Get paginated products
    $scope.getPaginatedProducts = function() {
        const startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
        const endIndex = startIndex + $scope.itemsPerPage;
        return $scope.productsData.slice(startIndex, endIndex);
    };
    
    // Change page
    $scope.changePage = function(page) {
        $scope.currentPage = page;
        $scope.paginatedProducts = $scope.getPaginatedProducts();
    };

    // Wishlist toggle
    $scope.toggleWishlist = function(product) {
        $scope.wishlistState[product.name] = !$scope.wishlistState[product.name];
        localStorage.setItem('wishlistState', JSON.stringify($scope.wishlistState));
    };

    // Add to cart (placeholder function)
    $scope.addToCart = function(product) {
        console.log('Added to cart:', product);
    };

    // Initialize products on load
    $scope.initializeProducts();
}]);
