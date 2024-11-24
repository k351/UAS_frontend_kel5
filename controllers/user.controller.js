angular.module('revifeApp')
.controller('UserController', ['$scope', '$http', function($scope, $http) {
    $scope.user = null;

    $scope.getUserData = function() {
        $http.get('/api/user')
            .then(response => {
                $scope.user = response.data;  
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    };
    $scope.getUserData();
}]);
