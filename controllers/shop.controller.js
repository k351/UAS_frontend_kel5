angular.module('revifeApp')
.controller('ShopController', ['$scope', '$http', '$filter', '$rootScope', function($scope, $http, $filter, $rootScope) {
    // Initialize products data
    $scope.productsData = [];
    $scope.filteredProductsData = [];
    $scope.categories = [];
    
    // Pagination settings
    $scope.currentPage = 1;
    $scope.itemsPerPage = 4;
    
    // Search and filter
    $scope.searchQuery =  $rootScope.searchQuery || '';
    $scope.selectedCategory = $rootScope.selectedCategory || 'none'; 
    
    // Initialize wishlist state
    $scope.wishlistState = JSON.parse(localStorage.getItem('wishlistState')) || {};
    
    // Initialize products
    $scope.initializeProducts = function() {
        $http.get('/api/products/') // Assuming products are fetched from this endpoint
        .then(response => {
            $scope.productsData = response.data;
            $scope.filteredProductsData = angular.copy($scope.productsData);
            
            // Retrieve stored search and filter queries if available

            if(!!$scope.searchQuery) {
                $rootScope.searchQuery = null;
                $scope.searchProducts();
            } 
            else if(!!$scope.selectedCategory) {
                $rootScope.filterQuery = null;
                $scope.filterByCategory();
            } 
            else {
                $scope.setupPagination();
            }  
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    };

    $scope.initializeCategories = function() {
        $http.get('/api/categories/shop') // Fetch categories from /shop endpoint
        .then(response => {
            $scope.categories = response.data; // Store category data
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
    };

    // Search products by query
    $scope.searchProducts = function() {
        if (!!$scope.searchQuery) {
            $scope.filteredProductsData = $scope.productsData.filter(product =>
                product.name.toLowerCase().includes($scope.searchQuery.toLowerCase())
            );
        }
        $scope.currentPage = 1;  // Reset pagination on search
        $scope.setupPagination();
    };

    // Category filtering
    $scope.filterByCategory = function() {
        if ($scope.selectedCategory === 'none') {
            $scope.filteredProductsData = $scope.productsData// Re-fetch all products if no category selected
        } else {
            $scope.filteredProductsData = $scope.productsData.filter(product => 
                product.category === $scope.selectedCategory
            );
        }
        $scope.currentPage = 1;  // Reset pagination
        $scope.setupPagination();
    };

    // Pagination setup
    $scope.setupPagination = function() {
        $scope.totalPages = Math.ceil($scope.filteredProductsData.length / $scope.itemsPerPage);
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
        return $scope.filteredProductsData.slice(startIndex, endIndex);
    };
    
    // Change page
    $scope.changePage = function(page) {
        if (page < 1 || page > $scope.totalPages) return;  
        $scope.currentPage = page;
        $scope.paginatedProducts = $scope.getPaginatedProducts();
    };


    // Wishlist toggle
    $scope.toggleWishlist = function(product) {
        $scope.wishlistState[product.name] = !$scope.wishlistState[product.name];
        localStorage.setItem('wishlistState', JSON.stringify($scope.wishlistState));
    };

    // Initialize products on load
    $scope.initializeProducts();
    $scope.initializeCategories();
}]);
