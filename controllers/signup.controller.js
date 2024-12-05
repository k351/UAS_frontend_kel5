angular.module('revifeApp')
    .controller('SignUpController', ['$scope', '$http', function ($scope, $http) {
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

        // Trim semua data sebelum dikirim
        $scope.submitForm = function () {
            $scope.formData.name = $scope.formData.name.trim();
            $scope.formData.email = $scope.formData.email.trim();
            $scope.formData.address.street = $scope.formData.address.street.trim();
            $scope.formData.address.city = $scope.formData.address.city.trim();
            $scope.formData.address.country = $scope.formData.address.country.trim();

            $http.post('/api/auth/register', $scope.formData)
                .then(function (response) {
                    if (response.status === 200) {
                        const redirectUrl = response.data.redirect || "/#!/";
                        alert('Registration successful!');
                        window.location.href = redirectUrl;
                    } else {
                        alert(response.data.message || 'Registration failed. Please try again.');
                    }
                })
                .catch(function (error) {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                });
        };
    }]);