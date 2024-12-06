angular.module('revifeApp')
    .controller('SignUpController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
        $scope.formData = {
            name: '',
            email: '',
            password: '',
            phoneNumber: '',
            address: {
                street: '',
                city: '',
                country: ''
            },
            role: 'user'
        };

        $scope.notification = {
            active: false,
            message: '',
            color: '#4caf50',
        };

        // Menampilkan notifikasi ketika terjadi event
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

        // Terima semua data sebelum dikirim
        $scope.submitForm = function () {
            $scope.formData.name = $scope.formData.name.trim();
            $scope.formData.email = $scope.formData.email.trim();
            $scope.formData.phoneNumber = $scope.formData.phoneNumber.trim();
            $scope.formData.password = $scope.formData.password.trim();
            $scope.formData.address.street = $scope.formData.address.street.trim();
            $scope.formData.address.city = $scope.formData.address.city.trim();
            $scope.formData.address.country = $scope.formData.address.country.trim();
            console.log($scope.formData);
            $http.post('/api/auth/register', $scope.formData)
                .then(function (response) {
                    if (response.status === 201) {
                        const redirectUrl = response.data.redirect || "/#!/";
                        $scope.showNotification('Registration successful!', '#4caf50');
                        window.location.href = redirectUrl;
                    } else {
                        $scope.showNotification('Registration failed. Please try again later.', '#f44336');
                    }
                })
                .catch(function (error) {
                    console.error('Error:', error);
                    if (error.status === 400 && error.data.message === 'User already exists') {
                        $scope.showNotification('The email is already registered. Please try another.', '#f44336');
                    } else {
                        $scope.showNotification('An error occurred. Please try again.', '#f44336');
    }
                });
        };
    }]);