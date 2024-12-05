angular.module('revifeApp').controller('AdminController', ['$scope', '$http', function ($scope, $http) {
    $scope.isDashboardVisible = true;
    $scope.isProductVisible = false;
    $scope.isCouponVisible = false;
    $scope.isCouponFormVisible = false;
    $scope.isProductFormVisible = false;
    $scope.isUsersVisible = false;
    $scope.selectedProduct = null;
    $scope.currentDate = new Date();

    $scope.coupons = [];
    $scope.users = [];

    $scope.newProduct = {
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
        quantity: ''
    };

    $scope.notification = {
        message: '',
        isError: false,
        isVisible: false
    };

    $scope.showNotification = function (message, isError = false) {
        $scope.notification.message = message;
        $scope.notification.isError = isError;
        $scope.notification.isVisible = true;
        $timeout(function () {
            $scope.notification.isVisible = false;
        }, 3000);
    };

    $scope.showDashboard = function () {
        $scope.isDashboardVisible = true;
        $scope.isProductVisible = false;
        $scope.isCouponVisible = false;
        $scope.isUsersVisible = false;
        $scope.isCouponFormVisible = false;
        $scope.isProductFormVisible = false;
    };

    $scope.showProducts = function () {
        $scope.isDashboardVisible = false;
        $scope.isProductVisible = true;
        $scope.isCouponVisible = false;
        $scope.isUsersVisible = false;
        $scope.isCouponFormVisible = false;
        $scope.isProductFormVisible = false;
    };

    $scope.showUsers = function () {
        $scope.isDashboardVisible = false;
        $scope.isProductVisible = false;
        $scope.isCouponVisible = false;
        $scope.isUsersVisible = true;
        $scope.isCouponFormVisible = false;
        $scope.isProductFormVisible = false;
    };

    $scope.showCoupons = function () {
        $scope.isDashboardVisible = false;
        $scope.isProductVisible = false;
        $scope.isCouponVisible = true;
        $scope.isUsersVisible = false;
        $scope.isProductFormVisible = false;
    };

    $scope.toggleCouponsForm = function () {
        $scope.isCouponFormVisible = !$scope.isCouponFormVisible;
    };

    $scope.toggleProductForm = function () {
        $scope.isProductFormVisible = !$scope.isProductFormVisible;
    };

    $scope.loadCoupons = function () {
        $http.get(`/api/coupons`)
            .then(function (response) {
                $scope.coupons = response.data.map(coupon => {
                    return {
                        ...coupon,
                        startAt: new Date(coupon.startAt),
                        expiresAt: new Date(coupon.expiresAt)
                    };
                });
            })
            .catch(function (error) {
                console.error('Error fetching coupons:', error);
                alert('Failed to fetch coupons.');
            });
    };

    $scope.loadUsers = function() {
        $http.get(`/api/users`)
            .then(function(response) {
                console.log('Fetched users:', response.data);
                $scope.users = response.data;
            })
            .catch(function(error) {
                console.error('Error fetching users:', error);
                alert('Failed to fetch users.');
            });
    };

    $scope.loadProducts = function() {
        $http.get(`/api/products`)
            .then(function(response) {
                console.log('Fetched products:', response.data);
                $scope.products = response.data;
            })
            .catch(function(error) {
                console.error('Error fetching products:', error);
                alert('Failed to fetch products.');
            });
    };

    $scope.showEditProductForm = function(product) {
        $scope.selectedProduct = { ...product };
        $scope.isProductFormVisible = true;
    };

    $scope.updateProduct = function(productId, newName, newPrice, newCategory, newDescription, newImage, newQuantity) {
        $http.put(`/api/products/update/${productId}`, {
            name: newName, 
            price: newPrice, 
            category: newCategory, 
            description: newDescription, 
            image: newImage, 
            quantity: newQuantity
        })
        .then(function() {
            $scope.loadProducts();
        })
        .catch(function(error) {
                console.error('Error updating product:', error);
        });
    };

    $scope.saveProductEdit = function() {
        if (!$scope.selectedProduct) return;
    
        $scope.updateProduct(
            $scope.selectedProduct._id, 
            $scope.selectedProduct.name, 
            $scope.selectedProduct.price, 
            $scope.selectedProduct.category, 
            $scope.selectedProduct.description, 
            $scope.selectedProduct.image, 
            $scope.selectedProduct.quantity
        );
    
        // Reset the form and hide it
        $scope.selectedProduct = null;
        $scope.isProductFormVisible = false;
    };

    $scope.deleteUser = function (userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            $http.delete(`/api/users/delete/${userId}`)
                .then(function () {
                    alert('User deleted successfully.');
                    $scope.loadUsers();
                })
                .catch(function (error) {
                    console.error('Error deleting user:', error);
                    alert('Failed to delete user.');
                });
        }
    };

    $scope.deleteProduct = function (productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            $http.delete(`/api/products/delete/${productId}`)
                .then(function () {
                    alert('Product deleted successfully.');
                    $scope.loadProducts();
                })
                .catch(function (error) {
                    console.error('Error deleting product:', error);
                    alert('Failed to delete product.');
                });
        }
    };

    $scope.addProduct = function(name, price, category, description, image, quantity) {
        if (!name || !price || !category || !description || !image || !quantity) {
            alert('Please fill in all fields before adding new product.');
            return;
        }

        $http.get(`/api/products/${name}`)
            .then(function (response) {
                if (response.data) {
                    alert(`The product ${name} already exists!`);
                } else {
                    $http.post('/api/products/add', {
                        name: name,
                        price: price,
                        category: category,
                        description: description,
                        image: image,
                        quantity: quantity
                    })
                        .then(function () {
                            alert('Product created successfully!');
                            $scope.loadProducts();
                            $scope.name = '';
                            $scope.price = '';
                            $scope.category = '';
                            $scope.description = '';
                            $scope.image = '';
                            $scope.quantity = '';
                        })
                        .catch(function (error) {
                            console.error('Error adding product', error);
                            alert(error.data.message || 'Failed to add product');
                        })
                }
            })
            .catch(function (error) {
                console.error('Error checking product:', error);
                alert('Failed to validate product name');
            })
    }

    $scope.addCoupon = function (couponCode, discountValue, discountType, startAt, expiresAt) {
        if (!couponCode || !discountValue || !discountType || !startAt || !expiresAt) {
            alert('Please fill in all fields before adding the coupon.');
            return;
        }

        let isPercentage = discountType === 'percentage';

        if (isPercentage && (discountValue <= 0 || discountValue > 100)) {
            alert('Discount percentage must be between 1 and 100.');
            return;
        }

        let startDate = new Date(startAt);
        let expiryDate = new Date(expiresAt);

        if (startDate > expiryDate) {
            alert('Start date must be before expiry date.');
            return;
        }

        $http.get(`/api/coupons/${couponCode}`)
            .then(function (response) {
                if (response.data) {
                    alert(`Coupon with code ${couponCode} already exists.`);
                } else {
                    $http.post('/api/coupons/add', {
                        couponCode: couponCode,
                        discountValue: discountValue,
                        discountType: discountType,
                        startAt: startAt,
                        expiresAt: expiresAt
                    })
                        .then(function () {
                            alert('Coupon added successfully!');
                            $scope.loadCoupons();
                            $scope.couponCode = '';
                            $scope.discountValue = '';
                            $scope.discountType = '';
                            $scope.startAt = '';
                            $scope.expiresAt = '';
                        })
                        .catch(function (error) {
                            console.error('Error adding coupon:', error);
                            alert(error.data.message || 'Failed to add coupon.');
                        });
                }
            })
            .catch(function (error) {
                console.error('Error checking coupon:', error);
                alert('Failed to validate coupon code.');
            });
    };


    $scope.deleteCoupon = function (couponId) {
        if (confirm('Are you sure you want to delete this coupon?')) {
            $http.delete(`/api/coupons/delete/${couponId}`)
                .then(function () {
                    alert('Coupon deleted successfully.');
                    $scope.loadCoupons();
                })
                .catch(function (error) {
                    console.error('Error deleting coupon:', error);
                    alert('Failed to delete coupon.');
                });
        }
    };

    $scope.loadCoupons();
    $scope.loadUsers();
    $scope.loadProducts();
    $scope.showDashboard();
}]);
