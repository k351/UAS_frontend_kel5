const component = angular.module('revifeApp');

component.directive('productBox', [function(){
    return{
        scope:{
            product: '=',
        },
        template: `<a href="product_{{product.index}}">
                        <img ng-src="{{product.image}}" alt="{{product.name}}">
                        <div class="desc">
                            <span>{{product.category}}</span>
                            <h5>{{product.name}}</h5>
                            <div class="star">
                                <i class="fa-solid fa-star" ng-repeat="n in [].constructor(product.stars) track by $index"></i>
                            </div>
                            <h4>{{product.price}}</h4>
                        </div>
                        <a ng-click="addToCart(product)">
                            <i class="fa-solid fa-cart-plus cart" ng-style="{'color': product.cart_icon_color}"></i>
                        </a>
                        <button class="wishlist-btn" ng-click="toggleWishlist(product)">
                            <i ng-class="wishlistState[product.name] ? 'fa-solid' : 'fa-regular'"
                                ng-style="{'color': wishlistState[product.name] ? 'var(--secondary-color)' : 'gray'}"
                                class="fa-heart"></i>
                        </button>
                    </a>`,
        controller: function($scope){
            $scope.wishlistState = JSON.parse(localStorage.getItem('wishlistState')) || {};
    
                // Toggle the wishlist
                $scope.toggleWishlist = function(product) {
                    $scope.wishlistState[product.name] = !$scope.wishlistState[product.name];
                    localStorage.setItem('wishlistState', JSON.stringify($scope.wishlistState));
                };
        }
    }
    
}]);