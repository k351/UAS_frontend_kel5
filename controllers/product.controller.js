angular.module('revifeApp').controller('ProductController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.product = {};
    $scope.quantity = 1;
    $scope.productId = $routeParams.id;
    $scope.compareList = [];
    $scope.compareProduct = null;
    $scope.isCompareListVisible = false;

    $scope.getProductById = function () {
        $http.get(`/api/products/${$scope.productId}`).then(function (response) {
            $scope.product = response.data;
        })
    }

    $scope.updateQuantity = function (quantity) {
        $scope.quantity = quantity;
    };

    $scope.loadCompareList = function () {
        $http.get('/api/products/compare').then(function (response) {
            $scope.compareList = response.data.filter(product => product._id !== $scope.productId);
            console.log('Compare List:', $scope.compareList);
        }).catch(function (error) {
            console.error('Error loading compare list:', error);
        });
    };

    $scope.openCompareList = function () {
        if ($scope.compareList && $scope.compareList.length > 0) {
            $scope.isCompareListVisible = true;
            console.log('Compare list opened:', $scope.isCompareListVisible);
        } else {
            alert('No products available for comparison');
        }
    };

    $scope.selectCompareProduct = function (product) {
        if (product._id !== $scope.productId) {
            $scope.compareProduct = product;
            $scope.isCompareListVisible = false;
        } else {
            alert('Cannot compare with the current product');
        }
    };

    $scope.removeCompareProduct = function () {
        $scope.compareProduct = null;
    };

    $scope.closeCompare = function () {
        $scope.isCompareListVisible = false;
    };


       $scope.getReviews = function () {
        $http.get(`/api/reviews/${$scope.productId}`).then(function (response) {
            $scope.reviews = response.data;
            $scope.averageRating = $scope.calculateAverageRating($scope.reviews);
        }).catch(function (error) {
            console.error('Error fetching reviews:', error);
            $scope.reviews = [];
        });
    };

    $scope.calculateAverageRating = function(reviews) {
        if (!reviews || reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    };

    $scope.getStars = function (rating) {
        const filledStars = new Array(Math.floor(rating)).fill(1);
        const emptyStars = new Array(5 - Math.floor(rating)).fill(0);

        return filledStars.concat(emptyStars); 
    };


    $scope.addToCart = function (product) {
        const quantityToAdd = $scope.quantity;
        $http.get('/api/cart')
            .then(function (response) {
                console.log('Cart data: ', response.data)
                const cart = response.data;
                const existingItem = cart.find(item => item.productId === product._id);
                if (existingItem) {
                    $http.put(`/api/cart/update/${existingItem._id}`, {
                        cartQuantity: existingItem.cartQuantity + quantityToAdd
                    }).then(function () {
                        alert('Item quantity updated in cart!');
                    }).catch(function (error) {
                        console.error('Error updating cart:', error);
                        alert('Failed to update item quantity in cart.');
                    });
                } else {
                    $http.post('/api/cart/add', {
                        productId: product._id,
                        cartQuantity: quantityToAdd
                    }).then(function () {
                        alert('Item added to cart successfully!');
                    }).catch(function (error) {
                        console.error('Error adding to cart:', error);
                        alert('Failed to add item to cart.');
                    });
                }
            }).catch(function (error) {
                console.error('Error retrieving cart items:', error);
                alert('Failed to retrieve cart items.');
            });
    };

    $scope.getProductById();
    $scope.getReviews();
    $scope.loadCompareList()
}
]);