angular.module('revifeApp').controller('SettingsController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
    const userId = $routeParams.userId; // Anda bisa mengambil userId dari params jika dibutuhkan
    console.log("User ID: ", userId)

    $scope.isEditing = false;
    $scope.showDeleteConfirmation = false;
    $scope.deleteConfirmation = '';
    $scope.password = {
        current: '',
        new: '',
        confirm: ''
    };

    // Ambil data pengguna dari API
    $http.get('/settings', {
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('authToken')
        }
    }).then(function (response) {
        $scope.user = response.data;
    }).catch(function (error) {
        alert('Gagal mengambil data pengguna: ' + error.message);
    });

    // Toggle mode edit profil
    $scope.toggleEdit = function () {
        $scope.isEditing = !$scope.isEditing;
    };

    // Memperbarui profil
    $scope.updateProfile = function () {
        if ($scope.profileForm.$valid) {
            // Kirim data ke server untuk memperbarui profil
            $http.post('/api/settings/update', {
                userId: userId,
                name: $scope.user.name,
                email: $scope.user.email,
                phoneNumber: $scope.user.phoneNumber,
                address: $scope.user.address
            }).then(function (response) {
                alert('Profil berhasil diperbarui');
                $scope.isEditing = false;
            }).catch(function (error) {
                alert('Gagal memperbarui profil: ' + error.data.message);
            });
        }
    };

    // Mengubah kata sandi
    $scope.changePassword = function () {
        if ($scope.password.new !== $scope.password.confirm) {
            alert('Kata sandi baru tidak cocok');
            return;
        }

        if ($scope.passwordForm.$valid) {
            $http.post('/api/password/change', {
                currentPassword: $scope.password.current,
                newPassword: $scope.password.new
            }).then(function (response) {
                alert('Kata sandi berhasil diubah');
                $scope.password = {
                    current: '',
                    new: '',
                    confirm: ''
                };
            }).catch(function (error) {
                alert('Gagal mengubah kata sandi: ' + error.data.message);
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
            $http.post('/api/account/delete', { userId: userId }).then(function (response) {
                alert('Akun berhasil dihapus');
                $location.path('/login');
            }).catch(function (error) {
                alert('Gagal menghapus akun: ' + error.data.message);
            });
        } else {
            alert('Konfirmasi tidak valid. Akun tidak dihapus.');
        }
    };

    // Logout
    $scope.logout = function () {
        $location.path('/login');
    };
}]);