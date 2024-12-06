angular.module('revifeApp').controller('CartController', ['$scope', '$http', '$rootScope', '$location', '$timeout', function($scope, $http, $rootScope, $location, $timeout) {
    // Inisialisasi variabel global
    $rootScope.cartItems = $rootScope.cartItems || [];
    $rootScope.cartTotal = $rootScope.cartTotal || 0;
    $rootScope.couponDiscount = $rootScope.couponDiscount || 0;
    // Konfigurasi notifikasi   
    $scope.notification = {
        active: false,
        message: '',
        color: '#4caf50',
    };
    // Fungsi untuk menampilkan notifikasi
    $scope.showNotification = function (message, color = '#4caf50') {
        $scope.notification.message = message;
        $scope.notification.color = color;
        $scope.notification.active = true;

        $timeout(function () {
            $scope.notification.active = false;
        }, 3000);
    };
     // Fungsi untuk menyembunyikan notifikasi
    $scope.hideNotification = function () {
        $scope.notification.active = false;
    };
    // Memuat item ke keranjang dari API
    $scope.loadCartItems = function() {
        $http.get('/api/cart/populate')
            .then(function(response) {
                $rootScope.cartItems = response.data.map(function(cartItem) {
                    return {    
                        id: cartItem._id,
                        name: cartItem.productId.name,
                        price: cartItem.productId.price,
                        image: cartItem.productId.image,
                        cartQuantity: cartItem.cartQuantity
                    };
                });
                $scope.calculateCartTotal();
            })
            .catch(function(error) {
                console.error('Error loading cart items:', error);
            });
    };

     // Mengupdate jumlah item dalam keranjang
    $scope.updateQuantity = function(cartItemId, newQuantity) {
        $http.put(`/api/cart/update/${cartItemId}`, { cartQuantity: newQuantity })
            .then(function() {
                $scope.loadCartItems();
            })
            .catch(function(error) {
                console.error('Error updating quantity:', error);
            });
    };

    // Menghapus item dari keranjang
    $scope.removeItem = function(cartItemId) {
        $http.delete(`/api/cart/delete/${cartItemId}`)
            .then(function() {
                $scope.loadCartItems();
            })
            .catch(function(error) {
                console.error('Error removing item:', error);
            });
    };

    // Reset keranjang belanja
    $rootScope.resetCart = function() {
        $rootScope.cartItems = [];
        $rootScope.cartTotal = 0;
        $rootScope.couponDiscount = 0;
    };

    // Menghitung total keranjang belanja
    $scope.calculateCartTotal = function() {
        let total = 0;
        $rootScope.cartItems.forEach(function(item) {
            total += item.cartQuantity * item.price;
        });
        $rootScope.cartTotal = total;
    };

    // Mengaplikasikan kode kupon
    $scope.applyCoupon = function(couponCode) {

        if (!couponCode) {
            console.error('Invalid coupon code.');
            return;
        }

        $http.get(`/api/coupons/${couponCode}`)
            .then(function(response) {
                const coupon = response.data;
            
            if (coupon) {
                if (coupon.discountType === "fixed") {
                    $rootScope.couponDiscount = coupon.discountValue;
                    if($rootScope.cartTotal < $rootScope.couponDiscount) {
                        $rootScope.couponDiscount = $rootScope.cartTotal;
                    }
                }
                else if (coupon.discountType === "percentage") {
                    $rootScope.couponDiscount = (coupon.discountValue / 100) * $scope.cartTotal;
                }
                else {
                    console.error(coupon.discountType);
                    $rootScope.couponDiscount = 0;
                }
                $scope.showNotification('Coupon added successfully!', '#4caf50');
            } else {
                if(!!$rootScope.couponDiscount) {
                    $scope.showNotification('Coupon not found, old coupon used.', '#f44336');
                }
                else {
                    $scope.showNotification('Coupon not found!', '#f44336');
                    $rootScope.couponDiscount = 0;
                }
            }
        })
        .catch(function(error) {
            console.error('Error loading coupon:', error);
            $rootScope.couponDiscount = 0;
        });
    };

        // Handling alamat di halaman checkout
    if ($location.path() === '/checkout') {
        $scope.isEditingAddress = false;
        $scope.editedAddress = {};
        
         // Memuat alamat pengguna
        $scope.loadAddress = function() {
            $http.get('/api/users/address')
                .then(function(response) {
                    $scope.userAddress = response.data;
                    $scope.editedAddress = angular.copy($scope.userAddress);
                })
                .catch(function(error) {
                    console.error('Error fetching address:', error);
                });
        };
        
        // Menyimpan alamat yang diubah
        $scope.saveAddress = function() {
            $http.put('/api/users/address/update', $scope.editedAddress)
                .then(function(response) {
                    $scope.userAddress = response.data.address; 
                    $scope.isEditingAddress = false; 
                    $scope.showNotification('Address updated successfully!', '#4caf50');
                })
                .catch(function(error) {
                    console.error('Error updating address:', error);
                    $scope.showNotification('Failed to update address.', '#f44336');
                });
        };
        // Membatalkan pengeditan alamat
        $scope.cancelEdit = function() {
            $scope.editedAddress = angular.copy($scope.userAddress); 
            $scope.isEditingAddress = false; 
        };
        // Memuat data alamat saat halaman dimuat
        $scope.loadAddress();
    }
    
    // Memuat item keranjang pada inisialisasi controller
    $scope.loadCartItems();
}]);
