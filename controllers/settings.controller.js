angular.module('revifeApp').controller('SettingsController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
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

    $scope.changePassword = function () {
        if ($scope.password.new !== $scope.password.confirm) {
            alert('Kata sandi baru tidak cocok.');
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
                alert(response.data.message || 'Kata sandi berhasil diubah.');
                $scope.password = {
                    current: '',
                    new: '',
                    confirm: ''
                };
            }).catch(function (error) {
                const errorMessage = error.data?.message || 'Terjadi kesalahan pada server.';
                alert('Gagal mengubah kata sandi: ' + errorMessage);
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
            alert('Gagal mengambil data pengguna: ' + error.message);
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
                alert('Profil berhasil diperbarui');
                $scope.isEditing = false;
            }).catch(function (error) {
                alert('Gagal memperbarui profil: ' + error.data.message);
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
            alert('Konfirmasi tidak valid. Ketik "HAPUS" dengan benar untuk menghapus akun.');
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
            alert('Gagal logout: ' + (error.data?.message || 'Unknown error'));
        });
    };

    $scope.loadUser();
}]);