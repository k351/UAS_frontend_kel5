angular.module('revifeApp').controller('HistoryController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.transactions = []; 
    $scope.isLoading = true; 
    $scope.errorMessage = ''; 

    // Fetch transaction history
    $scope.loadTransactionHistory = function () {
        $http.get('/api/history')
            .then(function (response) {
                $scope.transactions = response.data;
                $scope.isLoading = false;
            })
            .catch(function (error) {
                console.error('Error fetching transaction history:', error);
                $scope.errorMessage = 'Failed to load transaction history.';
                $scope.isLoading = false;
            });
    };

    // Helper method to calculate the total for an individual transaction item
    $scope.calculateItemTotal = function (item) {
        return item.quantity * item.price;
    };

    // Call the load function on controller initialization
    $scope.loadTransactionHistory();
}]);
