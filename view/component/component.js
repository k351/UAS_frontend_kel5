angular.module('revifeApp').directive('productBox' , ['$http', function($http) {
    return {
        scope: {
            product: '=' 
        },
        template: `
            <a href="#!/product/{{product._id}}">
                <img ng-src="{{product.image}}" alt="{{product.name}}">
                <div class="desc">
                    <span>{{product.category}}</span>
                    <h5>{{product.name}}</h5>
                    <h4>{{product.price}}</h4>
                </div>
                <a ng-click="addToCart(product)">
                    <i class="fa-solid fa-cart-plus cart" ng-style="{'color': product.cart_icon_color}"></i>
                </a>
            </a>
            
        <div class="notification-container" ng-class="{ 'active': notification.active }">
            <div class="notification" ng-style="{ backgroundColor: notification.color }">
                <p>{{ notification.message }}</p>
                <button class="close-btn" ng-click="hideNotification()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        </div>`
        ,
        controller: ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
        $scope.notification = {
            active: false,
            message: '',
            color: '#4caf50',
        };

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

            $scope.addToCart = function (product) {
                $http.get('/api/cart')
                    .then(function (response) {
                        const cart = response.data;
                        const existingItem = cart.find(item => item.productId === product._id);
                        if (existingItem) {
                            $http.put(`/api/cart/update/${existingItem._id}`, {
                                cartQuantity: existingItem.cartQuantity + 1
                            }).then(function () {
                                $scope.showNotification('Item quantity updated in cart!', '#4caf50');
                            }).catch(function (error) {
                                console.error('Error updating cart:', error);
                                $scope.showNotification('Failed to update item quantity in cart.', '#f44336');
                            });
                        } else {
                            $http.post('/api/cart/add', {
                                productId: product._id,
                                cartQuantity: 1
                            }).then(function () {
                                $scope.showNotification('Item added to cart successfully', '#4caf50');
                            }).catch(function (error) {
                                console.error('Error adding to cart:', error);
                                $scope.showNotification('Failed to add item to cart.', '#f44336');
                            });
                        }
                    }).catch(function (error) {
                        console.error('Error retrieving cart items:', error);
                        $scope.showNotification('Failed to retrieve cart items.', '#f44336');
                    });
            };
        }]
    };
}]);