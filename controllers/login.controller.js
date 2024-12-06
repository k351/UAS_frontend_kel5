angular.module("revifeApp").controller("LoginController", [
    "$scope",
    "$http",
    "$timeout",
    function ($scope, $http, $timeout) {
    // Stores user login credentials
    $scope.credentials = {
        email: "",
        password: "",
    };
    // Handles notification display 
    $scope.notification = {
        active: false,
        message: '',
        color: '#4caf50',
    };
     // Displays a notification with a message and optional color
    $scope.showNotification = function (message, color = '#4caf50') {
        $scope.notification.message = message;
        $scope.notification.color = color;
        $scope.notification.active = true;

        $timeout(function () {
            $scope.notification.active = false;
        }, 3000);
    };
    // Manually hides the notification
    $scope.hideNotification = function () {
        $scope.notification.active = false;
    };
        // Handles user login
        $scope.login = function () {
            if ($scope.credentials.email && $scope.credentials.password) {
                $http.post("/api/auth/login", {
                    email: $scope.credentials.email,
                    password: $scope.credentials.password,
                })
                    .then(function (response) {
                        // Simpan token di sessionStorage
                        const { token, username, userId } = response.data.loginSuccess;
                        console.log(userId);
                        sessionStorage.setItem("authToken", token);

                        // Redirect ke halaman yang sesuai
                        const redirectUrl = response.data.redirect || "/#!/admin-dashboard";
                        $scope.showNotification(`Login successful! Welcome, ${username}`, '#4caf50');
                        window.location.href = redirectUrl;
                    })
                    .catch(function (error) {
                        console.error('Login error:', error);
                        $scope.showNotification(error.data?.message || 'An error occured during login.', '#f44336');
                    });
            } else {
                $scope.showNotification('Please fill in both fields!', '#f44336');
            }
        };
    },
]);