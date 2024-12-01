angular.module('revifeApp').controller('AdminController', ['$scope', '$http', function($scope, $http) {
    $scope.isDashboardVisible = true;
    $scope.isProductVisible = false;
    $scope.isCouponVisible = false;
    $scope.isCouponFormVisible = false;
    $scope.isProductFormVisible = false;
    $scope.isUsersVisible = false;
    $scope.currentDate = new Date(); 

    $scope.coupons = [];

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

    $scope.showDashboard = function() {
        $scope.isDashboardVisible = true;
        $scope.isProductVisible = false;
        $scope.isCouponVisible = false;
        $scope.isUsersVisible = false;
        $scope.isCouponFormVisible = false;
        $scope.isProductFormVisible = false;
    };
    
    $scope.showProducts = function() {
        $scope.isDashboardVisible = false;
        $scope.isProductVisible = true;
        $scope.isCouponVisible = false;
        $scope.isUsersVisible = false;
        $scope.isCouponFormVisible = false;
        $scope.isProductFormVisible = false;
    };
    
    $scope.showUsers = function() {
        $scope.isDashboardVisible = false;
        $scope.isProductVisible = false;
        $scope.isCouponVisible = false;
        $scope.isUsersVisible = true;
        $scope.isCouponFormVisible = false;
        $scope.isProductFormVisible = false;
    };

    $scope.showCoupons = function() {
        $scope.isDashboardVisible = false;
        $scope.isProductVisible = false;
        $scope.isCouponVisible = true;
        $scope.isUsersVisible = false;
        $scope.isProductFormVisible = false;
    };

    $scope.toggleCouponsForm = function() {
        $scope.isCouponFormVisible = !$scope.isCouponFormVisible;
    };

    $scope.toggleProductForm = function() {
        $scope.isProductFormVisible = !$scope.isProductFormVisible;
    };
    
    $scope.loadCoupons = function() {
        $http.get(`/api/coupons`)
            .then(function(response) {
                $scope.coupons = response.data.map(coupon => {
                    return {
                        ...coupon,
                        startAt: new Date(coupon.startAt),
                        expiresAt: new Date(coupon.expiresAt)
                    };
                });
            })
            .catch(function(error) {
                console.error('Error fetching coupons:', error);
                alert('Failed to fetch coupons.');
            });
    };
    
    $scope.addCoupon = function(couponCode, discountValue, discountType, startAt, expiresAt) {
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
        .then(function(response) {
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
                    .then(function() {
                        alert('Coupon added successfully!');
                        $scope.loadCoupons();
                        $scope.couponCode = '';
                        $scope.discountValue = '';
                        $scope.discountType = '';
                        $scope.startAt = '';
                        $scope.expiresAt = '';
                    })
                    .catch(function(error) {
                        console.error('Error adding coupon:', error);
                        alert(error.data.message || 'Failed to add coupon.');
                    });
            }
        })
        .catch(function(error) {
            console.error('Error checking coupon:', error);
            alert('Failed to validate coupon code.');
        });
    };


    $scope.deleteCoupon = function(couponId) {
        if (confirm('Are you sure you want to delete this coupon?')) {
            $http.delete(`/api/coupons/delete/${couponId}`)
                .then(function() {
                    alert('Coupon deleted successfully.');
                    $scope.loadCoupons(); 
                })
                .catch(function(error) {
                    console.error('Error deleting coupon:', error);
                    alert('Failed to delete coupon.');
                });
        }
    };

    $scope.loadCoupons();
    $scope.showDashboard();
}]);
