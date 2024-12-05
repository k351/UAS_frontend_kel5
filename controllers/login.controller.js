angular.module("revifeApp").controller("LoginController", [
    "$scope",
    "$http",
    function ($scope, $http) {
        $scope.credentials = {
            email: "",
            password: "",
        };
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
                        alert(`Login successful! Welcome, ${username}`);
                        window.location.href = redirectUrl;
                    })
                    .catch(function (error) {
                        console.error('Login error:', error);
                        alert(error.data?.message || "An error occurred during login");
                    });
            } else {
                alert("Please fill in both fields!");
            }
        };
    },
]);