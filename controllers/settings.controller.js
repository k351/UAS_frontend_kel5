angular.module('revifeApp').controller('SettingsController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function ($scope, $http, $location, $routeParams, $timeout) {
    const userId = $routeParams.userId;
    $scope.isEditing = false;
    $scope.isEditingPassword = false;
    $scope.showDeleteConfirmation = false;
    $scope.deleteConfirmation = '';
    $scope.password = {
        current: '',
        new: '',
        confirm: ''
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

    $scope.changePassword = function () {
        if ($scope.password.new !== $scope.password.confirm) {
            $scope.showNotification('Kata sandi baru tidak cocok.', '#f44336');
            return;
        }

        if ($scope.passwordForm.$valid) {
            $http.put('/api/users/settings/password/update', {
                currentPassword: $scope.password.current,
                newPassword: $scope.password.new
            }, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('authToken')
                }
            }).then(function (response) {
                $scope.showNotification(response.data.message || 'Kata sandi berhasil diubah!', '#4caf50');
                $scope.password = {
                    current: '',
                    new: '',
                    confirm: ''
                };
            }).catch(function (error) {
                const errorMessage = error.data?.message || 'Terjadi kesalahan pada server.';
                $scope.showNotification('Failed to change password: ', '#f44336' + errorMessage);
            });
        }
    };

    $scope.loadUser = function () {
        $http.get('/api/users/settings', {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('authToken')
            }
        }).then(function (response) {
            $scope.user = response.data;
        }).catch(function (error) {
            $scope.showNotification('Failed to fetch users: ', '#f44336' + error.message);
        });
    }

    // Toggle mode edit profil
    $scope.toggleEdit = function () {
        $scope.isEditing = !$scope.isEditing;
    };

    // Memperbarui profil
    $scope.updateProfile = function () {
        if ($scope.profileForm.$valid) {
            $http.put('/api/users/settings/update', {
                userId: userId,
                name: $scope.user.name,
                email: $scope.user.email,
                phoneNumber: $scope.user.phoneNumber,
                address: {
                    street: $scope.user.address.street,
                    city: $scope.user.address.city,
                    country: $scope.user.address.country
                }
            }).then(function (response) {
                $scope.showNotification('Profile has been updated successfully!', '#4caf50');
                $scope.isEditing = false;
            }).catch(function (error) {
                $scope.showNotification('Failed to update profile: ', '#f44336' + error.data.message);
            });
        }
    };

    // Konfirmasi penghapusan akun
    $scope.confirmDeleteAccount = function () {
        $scope.showDeleteConfirmation = true;
    };

    // Menghapus akun
    $scope.deleteAccount = function () {
        if ($scope.deleteConfirmation.toUpperCase() === 'HAPUS') {
            if (confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) {
                $http.delete('/api/users/settings/delete', {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('authToken')
                    }
                }).then(function (response) {
                    alert(response.data.message || 'Akun berhasil dihapus.');
                    sessionStorage.removeItem('authToken'); // Hapus token session
                    $location.path('/login'); // Redirect ke halaman login
                }).catch(function (error) {
                    const errorMessage = error.data?.message || 'Terjadi kesalahan saat menghapus akun.';
                    alert('Gagal menghapus akun: ' + errorMessage);
                });
            }
        } else {
            $scope.showNotification('Confirmation invalid, Type "HAPUS" correctly to delete account.', '#f44336');
        }
    };

    // Logout
    $scope.logout = function () {
        $http.post('/api/users/settings/logout').then(function (response) {
            console.log('Logout response:', response.data); // Debug respon server
            sessionStorage.removeItem('authToken'); // Hapus token dari session storage
            $location.path('/login'); // Redirect ke halaman login
        }).catch(function (error) {
            console.error('Error during logout:', error);
            $scope.showNotification('Failed to logout: ', '#f44336' + (error.data?.message || 'Unknown error'));
        });
    };

    $scope.loadUser();
}]);