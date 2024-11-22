angular.module('revifeApp').controller('LoginController', function($scope, $http) {
    $scope.login = function() {
        $http.post('/api/auth/login', $scope.credentials)
        .then(function(response) {
            // Store token in localStorage
            localStorage.setItem('token', response.data.token);
            
            // Redirect based on role
            if (response.data.user.role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/dashboard';
            }
        })
        .catch(function(error) {
            $scope.errorMessage = 'Login failed';
        });
    };
});