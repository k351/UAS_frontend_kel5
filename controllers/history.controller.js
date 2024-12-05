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

   // Modify the open rating modal method
    $scope.openRatingModal = function (transactionItem) {
        if (!transactionItem || !transactionItem.productId) {
            console.error('Invalid transaction item:', transactionItem);
            return;
        }
        $scope.currentTransactionItemId = transactionItem._id;
        $scope.currentProductName = transactionItem.productId.name;
        $scope.isRatingModalOpen = true;
    };
    
    // Close rating modal
    $scope.closeRatingModal = function () {
        document.getElementById('ratingModal').style.display = 'none';
    };

    // Submit rating
    $scope.submitRating = function () {
        const rating = $scope.rating;
        const review = $scope.review;
        const transactionItemId = $scope.currentTransactionItemId;

        if (!rating || rating < 1 || rating > 5) {
            alert('Please provide a rating between 1 and 5.');
            return;
        }

        $http.post('/api/history/rate', { 
            transactionItemId, 
            rating, 
            review 
        })
        .then(function (response) {
            alert('Rating submitted successfully!');
            $scope.closeRatingModal();
            $scope.rating = null;
            $scope.review = '';
            $scope.currentTransactionItemId = null;
            
            // Optionally refresh the transaction history to reflect the new rating
            $scope.loadTransactionHistory();
        })
        .catch(function (error) {
            console.error('Error submitting rating:', error);
            alert('Error submitting rating. Please try again.');
        });
    };


    // Add a method to check if an item has been rated
    $scope.isRated = function(item) {
        return item.rating && item.rating > 0;
    };
    
    // Call the load function on controller initialization
    $scope.loadTransactionHistory();
}]);
