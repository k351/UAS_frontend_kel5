angular.module('revifeApp', [])
.controller('ShopController', ['$scope', '$filter', function($scope, $filter) {
    // Initialize products data (assuming you'll load this from a service)
    $scope.productsData = []; // Populate with your product data
    $scope.filteredProducts = [];
    
    // Pagination settings
    $scope.currentPage = 1;
    $scope.itemsPerPage = 4;
    
    // Search and filter
    $scope.searchQuery = '';
    $scope.selectedCategory = 'none';
    
    // Initialize wishlist state
    $scope.wishlistState = JSON.parse(localStorage.getItem('wishlistState')) || {};
    
    // Initial load and filtering
    $scope.initializeProducts = function() {
        // Check localStorage for previous search/filter
        const storedSearchQuery = localStorage.getItem('searchQuery');
        const storedFilterQuery = localStorage.getItem('filterQuery');
        
        if (storedSearchQuery && storedSearchQuery !== '') {
            $scope.searchQuery = storedSearchQuery;
            $scope.searchProducts();
            localStorage.removeItem('searchQuery');
        } else if (storedFilterQuery && storedFilterQuery !== 'none') {
            $scope.selectedCategory = storedFilterQuery;
            $scope.filterByCategory();
            localStorage.removeItem('filterQuery');
        } else {
            $scope.filteredProducts = $scope.productsData;
        }
        
        $scope.setupPagination();
    };
    
    // Search functionality
    $scope.searchProducts = function() {
        const searchTerm = $scope.searchQuery.toUpperCase();
        $scope.filteredProducts = $scope.productsData.filter(product => 
            product.name.toUpperCase().includes(searchTerm)
        );
        
        $scope.currentPage = 1;
        $scope.setupPagination();
    };
    
    // Category filtering
    $scope.filterByCategory = function() {
        if ($scope.selectedCategory === 'none') {
            $scope.filteredProducts = $scope.productsData;
        } else {
            $scope.filteredProducts = $scope.productsData.filter(product => 
                product.category.toUpperCase() === $scope.selectedCategory.toUpperCase()
            );
        }
        
        $scope.currentPage = 1;
        $scope.setupPagination();
    };
    
    // Pagination setup
    $scope.setupPagination = function() {
        $scope.totalPages = Math.ceil($scope.filteredProducts.length / $scope.itemsPerPage);
        $scope.pages = [];
        
        for (let i = 1; i <= $scope.totalPages; i++) {
            $scope.pages.push(i);
        }
        
        $scope.paginatedProducts = $scope.getPaginatedProducts();
    };
    
    // Get paginated products for current page
    $scope.getPaginatedProducts = function() {
        const startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
        const endIndex = startIndex + $scope.itemsPerPage;
        
        return $scope.filteredProducts.slice(startIndex, endIndex);
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
        // Implement cart logic
        console.log('Added to cart:', product);
    };
    
    // Initialize on controller load
    $scope.initializeProducts();
}]);