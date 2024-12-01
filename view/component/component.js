angular.module('revifeApp').directive('productBox', ['CartService', function(CartService) {
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
                    <div class="star">
                        <i class="fa-solid" ng-repeat="n in [].constructor(product.stars) track by $index"></i>
                    </div>
                    <h4>{{product.price}}</h4>
                </div>
                <a ng-click="addToCart(product)">
                    <i class="fa-solid fa-cart-plus cart" ng-style="{'color': product.cart_icon_color}"></i>
                </a>
            </a>`,
        controller: ['$scope', 'CartService', function($scope, CartService) {
            $scope.addToCart = function(product) {
                CartService.getCartItems()
                    .then(function(cart) {
                        const existingItem = cart.find(item => item.productId === product._id);
                        if (existingItem) {
                            CartService.updateQuantity(existingItem._id, existingItem.cartQuantity + 1)
                                .then(function() {
                                    alert('Item quantity updated in cart!');
                                })
                                .catch(function(error) {
                                    console.error('Error updating cart:', error);
                                    alert('Failed to update item quantity in cart.');
                                });
                        } else {
                            CartService.addToCart(product._id, 1)
                                .then(function() {
                                    alert('Item added to cart successfully!');
                                })
                                .catch(function(error) {
                                    console.error('Error adding to cart:', error);
                                    alert('Failed to add item to cart.');
                                });
                        }
                    })
                    .catch(function(error) {
                        console.error('Error retrieving cart items:', error);
                        alert('Failed to retrieve cart items.');
                    });
            };
        }]
    };
}]);