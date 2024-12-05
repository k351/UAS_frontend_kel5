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
            css: ['style/style.css', 'style/cart.css', 'style/header.css', 'style/footer.css'],
            resolve: {
                checkLogin: ['AuthService', function(AuthService) {
                    return AuthService.checkLogin(); 
                }]
            }
        })
        .when('/wishlist', {
            templateUrl: 'pages/wishlist.html',
            controller: 'WishlistController',
            css: ['style/style.css', 'style/wishlist.css', 'style/header.css', 'style/footer.css'],
            resolve: {
                checkLogin: ['AuthService', function(AuthService) {
                    return AuthService.checkLogin(); 
                }]
            }
        })
        .when('/settings', {
            templateUrl: 'pages/settings.html',
            controller: 'SettingsController',
            css: ['style/style.css', 'style/settings.css', 'style/header.css', 'style/footer.css'],
            resolve: {
                checkLogin: ['AuthService', function(AuthService) {
                    return AuthService.checkLogin(); 
                }]
            }
        })
        .when('/history', {
            templateUrl: 'pages/history.html',
            controller: 'HistoryController',
            css: ['style/style.css', 'style/history.css', 'style/header.css', 'style/footer.css']
        })
        .when('/product/:id', {
            templateUrl: 'pages/product.html',
            controller: 'ProductController',
            css: ['style/style.css', 'style/product.css', 'style/header.css','style/footer.css']
        })
        .when('/checkout', {
            templateUrl: 'pages/checkout.html',
            controller: 'CheckoutController',
            css: ['style/style.css', 'style/checkout.css', 'style/header.css', 'style/footer.css'],
            resolve: {
                checkLogin: ['AuthService', function(AuthService) {
                    return AuthService.checkLogin(); 
                }]
            }
        })
        .when('/admin-dashboard', {
            templateUrl: 'pages/admin-dashboard.html',
            controller: 'AdminController',
            css: ['style/style.css', 'style/admin.css'],
            resolve: {
                checkAdmin: ['AuthService', function(AuthService) {
                    return AuthService.checkAdmin();
                }]
            }
        })        
        .otherwise({
            redirectTo: '/'
        });
}]);

revifeApp.factory('AuthService', ['$http', '$location', '$q', function($http, $location, $q) {
    return {
        checkLogin: function() {
            return $http.get('/api/auth/check')
                .then(function(response) {
                    return response;
                })
                .catch(function(error) {
                    $location.path('/login').replace();
                    return $q.reject('Login required');
                });
        },
        checkAdmin: function() {
            return $http.get('/api/auth/admin-check')
                .then(function(response) {
                    if (response.data.role === 'admin') {
                        return response;
                    } else {
                        return $q.reject({
                            status: 403,
                            message: 'Admin privileges required'
                        });
                    }
                })
                .catch(function(error) {
                    $location.path('/').replace(); 
                    return $q.reject(error);
                });
        }
    };
}]);


revifeApp.factory('AuthInterceptor', ['$q', '$location', function($q, $location) {
    return {
        responseError: function(rejection) {
            if (rejection.status === 401) {
                $location.path('/login').replace();
            } else if (rejection.status === 403) {
                $location.path('/').replace();
            }
            return $q.reject(rejection);
        }
    };
}]);

revifeApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
}]);


revifeApp.run(['$rootScope', '$location', 'loadCSS', function($rootScope, $location, loadCSS) {
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        const path = $location.path();
        $rootScope.isLoginPage = (path === '/login');
        $rootScope.isSignupPage = (path === '/signup');
        $rootScope.isAdminPage = (path === '/admin-dashboard');
        if (current.$$route && current.$$route.css) {
            loadCSS(current.$$route.css);
        }
    });
}]);