angular.module('revifeApp').controller('AdminController', ['$scope', '$http', function ($scope, $http) {
    $scope.isProductVisible = false;
    $scope.isProductFormVisible = false;

    $scope.isCouponVisible = false;
    $scope.isCouponFormVisible = false;

    $scope.isUsersVisible = false;

    $scope.isCategoryVisible = false;
    $scope.isCategoryFormVisible = false;

    $scope.isTransactionVisible = true;

    $scope.currentDate = new Date();
    $scope.isEditMode = false;

    $scope.coupons = [];
    $scope.users = [];
    $scope.categories = [];

    $scope.newProduct = {
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
        quantity: ''
    };

    $scope.couponEditMode = false;

    $scope.notification = {
        message: '',
        isError: false,
        isVisible: false
    };
    

    $scope.productFileName = 'No file chosen';
    $scope.CategoryFileName = 'No file chosen';

    $scope.updateProductFileName = function () {
        var fileInput = document.getElementById('ProductFileInput');
        var file = fileInput.files[0];
        if (file) {
            $scope.productFileName = file.name;
        } else {
            $scope.productFileName = 'No file chosen';
        }
        $scope.$apply();
    };

    $scope.updateCategoryFileName = function () {
        var fileInput = document.getElementById('categoryFileInput');
        var file = fileInput.files[0];
        if (file) {
            $scope.CategoryFileName = file.name;
        } else {
            $scope.CategoryFileName = 'No file chosen';
        }
        $scope.$apply();
    };



    $scope.showNotification = function (message, isError = false) {
        $scope.notification.message = message;
        $scope.notification.isError = isError;
        $scope.notification.isVisible = true;
        $timeout(function () {
            $scope.notification.isVisible = false;
        }, 3000);
        $scope.isTransactionVisible = false;
    };

    $scope.showDashboard = function () {
        $scope.isDashboardVisible = true;
        $scope.isProductVisible = false;
        $scope.isCouponVisible = false;
        $scope.isUsersVisible = false;
        $scope.isCouponFormVisible = false;
        $scope.isProductFormVisible = false;
        $scope.isTransactionVisible = false;
        $scope.isCategoryVisible = false;
    };

    $scope.showProducts = function () {
        $scope.isDashboardVisible = false;
        $scope.isProductVisible = true;
        $scope.isCouponVisible = false;
        $scope.isUsersVisible = false;
        $scope.isCouponFormVisible = false;
        $scope.isProductFormVisible = false;
        $scope.isCategoryVisible = false;
        $scope.isTransactionVisible = false;


    };

    $scope.showUsers = function () {
        $scope.isDashboardVisible = false;
        $scope.isProductVisible = false;
        $scope.isCouponVisible = false;
        $scope.isUsersVisible = true;
        $scope.isCouponFormVisible = false;
        $scope.isProductFormVisible = false;
        $scope.isCategoryVisible = false;
        $scope.isTransactionVisible = false;

    };

    $scope.showCategories = function () {
        $scope.isDashboardVisible = false;
        $scope.isProductVisible = false;
        $scope.isCouponVisible = false;
        $scope.isUsersVisible = false;
        $scope.isCategoryVisible = true;
        $scope.isTransactionVisible = false;
    };

    $scope.showCoupons = function () {
        $scope.isDashboardVisible = false;
        $scope.isProductVisible = false;
        $scope.isCouponVisible = true;
        $scope.isUsersVisible = false;
        $scope.isProductFormVisible = false;
        $scope.isTransactionVisible = false;
        $scope.isCategoryVisible = false;
    };

    $scope.showTransactions = function () {
        $scope.isTransactionVisible = true;
        $scope.isDashboardVisible = false;
        $scope.isProductVisible = false;
        $scope.isCouponVisible = false;
        $scope.isUsersVisible = false;
        $scope.isProductFormVisible = false;
        $scope.isCategoryVisible = false;
    };

    $scope.toggleCouponsForm = function () {
        $scope.isCouponFormVisible = !$scope.isCouponFormVisible;
    };

    $scope.toggleProductForm = function () {
        $scope.isProductFormVisible = !$scope.isProductFormVisible;
    };

    $scope.toggleCategoryForm = function () {
        $scope.isCategoryFormVisible = !$scope.isCategoryFormVisible;
    };

    $scope.loadCategories = function () {
        $http.get(`/api/categories`)
            .then(function (response) {
                $scope.categories = response.data;
            })
            .catch(function (error) {
                console.error('Error fetching categories:', error);
                alert('Failed to fetch categories.');
            });
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

    $scope.loadUsers = function () {
        $http.get(`/api/users`)
            .then(function (response) {
                console.log('Fetched users:', response.data);
                $scope.users = response.data;
            })
            .catch(function (error) {
                console.error('Error fetching users:', error);
                alert('Failed to fetch users.');
            });
    };

    $scope.loadProducts = function () {
        $http.get(`/api/products`)
            .then(function (response) {
                console.log('Fetched products:', response.data);
                $scope.products = response.data;
            })
            .catch(function (error) {
                console.error('Error fetching products:', error);
                alert('Failed to fetch products.');
            });
    };

    $scope.showEditProductForm = function (product) {
        // Instead of creating a copy, directly set the form fields
        $scope.name = product.name;
        $scope.price = product.price;
        $scope.category = product.category;
        $scope.description = product.description;
        $scope.quantity = product.quantity;
        $scope.category = product.category;

        // Keep track of the product ID for updating
        $scope.editProductId = product._id;

        $scope.isEditMode = true;
        $scope.isProductFormVisible = true;
    };

    $scope.saveProductEdit = function () {
        if (!$scope.editProductId) return;

        $scope.updateProduct(
            $scope.editProductId,
            $scope.name,
            $scope.price,
            $scope.category,
            $scope.description,
            $scope.quantity
        );

        // Reset form and mode
        $scope.resetProductForm();
    };

    $scope.updateProduct = function (productId, newName, newPrice, newCategory, newDescription, newQuantity) {

        if (!newName || !newPrice || !newCategory || !newDescription || !newQuantity) {
            alert('Please fill in all fields before adding new product.');
            return;
        }

        const categoryExists = $scope.categories.some(cat => cat.name === newCategory);

        if (!categoryExists) {
            alert(`The category "${newCategory}" does not exist. Please choose a valid category.`);
            return;
        }

        var fileInput = document.getElementById('ProductFileInput');
        var file = fileInput.files[0];

        var formData = new FormData();

        formData.append('name', newName);
        formData.append('price', newPrice);
        formData.append('category', newCategory);
        formData.append('description', newDescription);
        formData.append('quantity', newQuantity);
    
        if (file) {
            formData.append('image', file);
        }
    
        $http.put(`/api/products/update/${productId}`, formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
        .then(function (response) {
            alert('Product updated successfully!');
            $scope.resetProductForm();
            $scope.loadProducts();
        })
        .catch(function (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product.');
        });
    };

    $scope.resetProductForm = function () {
        // Clear all form fields
        $scope.name = '';
        $scope.price = '';
        $scope.category = '';
        $scope.description = '';
        document.getElementById('ProductFileInput').value = '';
        $scope.quantity = '';

        // Reset edit-related variables
        $scope.editProductId = null;
        $scope.isEditMode = false;
        $scope.isProductFormVisible = false;
        $scope.productFileName = 'No file chosen';
    };

    $scope.resetCategoryForm = function () {  
        $scope.categoryName = '';
        $scope.isOnHome = false;
        document.getElementById('categoryFileInput').value = '';
        $scope.isCategoryFormVisible = false;
        $scope.CategoryFileName = 'No file chosen';
    };

    $scope.resetCouponForm = function () {  
        $scope.couponCode = '';
        $scope.discountValue = '';
        $scope.discountType = '';
        $scope.startAt = '';
        $scope.expiresAt = '';
        $scope.isCouponFormVisible = false;
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
                    $scope.resetProductForm();
                    $scope.loadProducts();
                })
                .catch(function (error) {
                    console.error('Error deleting product:', error);
                    alert('Failed to delete product.');
                });
        }
    };

    $scope.addProduct = function (name, price, category, description, quantity) {
        if (!name || !price || !category || !description || !quantity) {
            alert('Please fill in all fields before adding new product.');
            return;
        }

        $http.get(`/api/products/name/${name}`)
            .then(function (response) {
                if (response.data.exists) {
                    alert(`The product ${name} already exists!`);
                } else {
                    var formData = new FormData();
                    formData.append('name', name);
                    formData.append('price', price);
                    formData.append('category', category);
                    formData.append('description', description);
                    formData.append('quantity', quantity);
                    formData.append('image', file);

                    $http.post('/api/products/add', formData, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined },
                    })
                        .then(function () {
                            alert('Product created successfully!');
                            $scope.loadProducts();
                            $scope.resetProductForm();
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

        if(discountValue < 1) {
            alert('Please fill the discount value more than one');
            return;
        }

        if (discountType != 'percentage' || discountType != 'fixed') {
            alert('Please fill discount type correctly.');
            return;
        }

        let isPercentage = discountType === 'percentage';

        if (isPercentage && (discountValue <= 0 || discountValue > 100)) {
            alert('Discount percentage must be between 1 and 100.');
            return;
        }


        if (startAt > expiresAt) {
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

    $scope.showCouponEditForm = function (coupon) {
        $scope.couponCode = coupon.couponCode;
        $scope.discountValue = coupon.discountValue;
        $scope.discountType = coupon.discountType;
        $scope.startAt = coupon.startAt;
        $scope.description = coupon.description;
        $scope.expiresAt = coupon.expiresAt;

        $scope.couponId = coupon._id

        $scope.couponEditMode = true;
        $scope.isCouponFormVisible = true;
    }

    $scope.updateCoupon = function (couponId, newCouponCode, newDiscountValue, newDiscountType, newStartAt, newExpiresAt) {


        if (!newCouponCode || !newDiscountValue || !newDiscountType || !newStartAt || !newExpiresAt) {
            alert('Please fill in all fields before adding the coupon.');
            return;
        }

        if(newDiscountValue < 1) {
            alert('Please fill the discount value more than one');
            return;
        }
        
        let isPercentage = newDiscountType === 'percentage';

        if (isPercentage && (newDiscountValue <= 0 || newDiscountValue > 100)) {
            alert('Discount percentage must be between 1 and 100.');
            return;
        }


        if (newStartAt > newExpiresAt) {
            alert('Start date must be before expiry date.');
            return;
        }

        $http.put(`/api/coupons/update/${couponId}`, {
            couponCode: newCouponCode,
            discountValue: newDiscountValue,
            discountType: newDiscountType,
            startAt: newStartAt,
            expiresAt: newExpiresAt
        })
            .then(function () {
                alert('Coupon updated successfully!');
                $scope.couponId = '';
                $scope.couponCode = '';
                $scope.discountValue = '';
                $scope.discountType = '';
                $scope.startAt = '';
                $scope.expiresAt = '';
                $scope.loadCoupons();
            })
            .catch(function (error) {
                alert("Error updating coupon: " + error);
            })
    }

    $scope.addCategory = function (categoryName, isOnHome) {
        if(!categoryName) {
            alert('Please fill the category name.');
            return;
        }

        var fileInput = document.getElementById('categoryFileInput');
        var file = fileInput.files[0];

        if (!file) {
            alert('Please select an image file.');
            return;
        }

        var formData = new FormData();
        formData.append('name', categoryName);
        formData.append('isOnHome', isOnHome);
        formData.append('image', file);

        $http.post('/api/categories/add', formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined },
        })
            .then(function (response) {
                alert('Category created successfully!');
                $scope.loadCategories();
                $scope.resetCategoryForm();
            })
            .catch(function (error) {
                alert('Error creating category: ' + (error.data.message || 'Unknown error.'));
            });
    };

    $scope.changeOnHomeStatus = function (categoryId) {
        const category = $scope.categories.find(cat => cat._id === categoryId);
        if (category) {
            category.isOnHome = !category.isOnHome;  

            $http.put(`/api/categories/update/${categoryId}`, {
                isOnHome: category.isOnHome
            })
            .then(function (response) {
                alert('Category status updated successfully!');
                $scope.loadCategories(); 
            })
            .catch(function (error) {
                console.error('Error updating category status:', error);
                alert('Failed to update category status.');
            });
        }
    };

    $scope.deleteCategory = function (categoryId) {
        if (confirm('Are you sure you want to delete this category?')) {
            $http.delete(`/api/categories/delete/${categoryId}`)
                .then(function () {
                    alert('Category deleted successfully.');
                    $scope.loadCategories();
                })
                .catch(function (error) {
                    console.error('Error deleting category:', error);
                    alert('Failed to delete category.');
                });
        }
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
    
    // Fetch transaction history
    $scope.loadTransactionHistory = function () {
        $http.get('/api/history/all')
            .then(function (response) {
                $scope.transactions = response.data;
                console.log($scope.transactions)
                $scope.isLoading = false;
            })
            .catch(function (error) {
                console.error('Error fetching transaction history:', error);
                $scope.errorMessage = 'Failed to load transaction history.';
                $scope.isLoading = false;
            });
    };

    $scope.loadCoupons();
    $scope.loadCategories();
    $scope.loadCoupons();
    $scope.loadUsers();
    $scope.loadProducts();
    $scope.showDashboard();
    angular.element(document.getElementById('ProductFileInput')).on('change', $scope.updateProductFileName);
    angular.element(document.getElementById('categoryFileInput')).on('change', $scope.updateCategoryFileName);
    $scope.loadTransactionHistory();
}]);
