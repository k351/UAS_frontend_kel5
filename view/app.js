const revifeApp = angular.module('revifeApp', ['ngRoute']);

revifeApp.factory('loadCSS', ['$document', function($document) {
    return function(cssFiles) {
        // Remove any previously loaded CSS
        const head = $document.find('head')[0];
        const existingLinks = head.querySelectorAll('link[rel="stylesheet"]');
        existingLinks.forEach(link => link.remove());

        // Add the new CSS files
        cssFiles.forEach(file => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = file;
            head.appendChild(link);
        });
    };
}]);

// revifeApp.config(['$locationProvider', function($locationProvider) {
//     $locationProvider.html5Mode({
//         enabled: true,
//         requireBase: false
//     });
// }]);

revifeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'HomeController',
            css: ['style/style.css', 'style/home.css', 'style/header.css', 'style/footer.css', 'style/products.css', 'style/categories.css', 'style/carousel.css', 'style/cart.css', 'style/checkout.css']
        })
        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'LoginController',
            css: ['style/style.css', 'style/login.css']
        })
        .when('/signup', {
            templateUrl: 'pages/signup.html',
            controller: 'SignUpController',
            css: ['style/style.css', 'style/signup.css']
        })
        .when('/shop', {
            templateUrl: 'pages/shop.html',
            controller: 'ShopController',
            css: ['style/style.css', 'style/header.css', 'style/products.css', 'style/footer.css', 'style/cart.css', 'style/checkout.css']
        })
        .when('/cart', {
            templateUrl: 'pages/cart.html',
            controller: 'CartController',
            css: ['style/style.css', 'style/cart.css', 'style/header.css', 'style/footer.css']
        })
        .when('/wishlist', {
            templateUrl: 'pages/wishlist.html',
            controller: 'WishlistController',
            css: ['style/style.css', 'style/wishlist.css', 'style/header.css', 'style/footer.css']
        })
        .when('/settings', {
            templateUrl: 'pages/settings.html',
            controller: 'SettingsController',
            css: ['style/style.css', 'style/settings.css', 'style/header.css', 'style/footer.css']
        })
        .when('/checkout', {
            templateUrl: 'pages/checkout.html',
            controller: 'CheckoutController',
            css: ['style/style.css', 'style/checkout.css']
        })
        .when('/product/:id', {
            templateUrl: 'pages/product.html',
            controller: 'ProductController',
            css: ['style/style.css', 'style/product.css', 'style/header.css', 'style/footer.css']
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

revifeApp.run(['$rootScope', '$location', 'loadCSS', function($rootScope, $location, loadCSS) {
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        const path = $location.path();
        // Atur visibilitas header dan footer berdasarkan rute
        $rootScope.isLoginPage = (path === '/login');
        $rootScope.isSignupPage = (path === '/signup');
        if (current.$$route && current.$$route.css) {
            loadCSS(current.$$route.css);
        }
    });
}]);