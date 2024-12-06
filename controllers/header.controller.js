angular.module('revifeApp')
    .controller('HeaderController', ['$scope', '$window', '$document', '$location','$rootScope','$route',
    function($scope, $window, $document, $location, $rootScope, $route) {
        $scope.searchQuery = '';
        // Dark Mode functionality
        $scope.initDarkMode = function() {
            $scope.darkTheme = $document[0].getElementById("dark-theme");
            
            if($window.localStorage.getItem("theme") === "dark") {
                $document[0].body.classList.add("darkmode");
                $scope.darkTheme.src = "../images/icon/sun.png";
            } else {
                $scope.darkTheme.src = "../images/icon/moon.png";
            }
        };

        // Dark Mode toggle
        $scope.toggleDarkMode = function() {
            $document[0].body.classList.toggle("darkmode");
            if ($document[0].body.classList.contains("darkmode")) {
                $scope.darkTheme.src = "../images/icon/sun.png";
                $window.localStorage.setItem("theme", "dark");
            } else {
                $scope.darkTheme.src = "../images/icon/moon.png";
                $window.localStorage.setItem("theme", "light");
            }
        };

        // Hamburger Menu functionality
        $scope.toggleMenu = function() {
            const hamburger = $document[0].querySelector(".hamburger");
            const navMenu = $document[0].querySelector(".nav-menu");
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        };

        // Explore Menu functionality
        $scope.initSearchBox = function() {
            $scope.searchInput = $document[0].querySelector('.search-header input');
            $scope.blackBox = $document[0].querySelector(".black-box");

            // Add event listeners for search input
            $scope.searchInput.addEventListener('focus', function() {
                $scope.isBlackBoxVisible = true;
                $scope.$apply();
            });

            $scope.searchInput.addEventListener('blur', function() {
                $scope.isBlackBoxVisible = false;
                $scope.$apply();
            });
        };

        // Search functionality
        $scope.handleHeaderSearch = function() {
            $rootScope.searchQuery = $scope.searchQuery; 
            $scope.searchQuery ='';
            if ($location.path() === '/shop') {
                $route.reload();
            } else {
                $window.location.href = '#!/shop';
            }
        };
        
        // Responsive menu
        $scope.initResponsiveMenu = function() {
            const mediaQuery = $window.matchMedia('(max-width: 768px)');
            $scope.updateNav(mediaQuery);
            
            mediaQuery.addListener(function(e) {
                $scope.$apply(function() {
                    $scope.updateNav(e);
                });
            });
        };

        // Handle Scroll Behavior
        $scope.handleScrollBehavior = function() {
            const currentPage = $location.path();
            const searchHidden = $document[0].querySelector('.search-header');
            $scope.isSearchVisible = false;
        
            if (currentPage === '/') {
                angular.element($window).on('scroll', function() {
                    const searchLimiter = $document[0].querySelector('.home');
                    if (searchLimiter) { // Pastikan elemen ada
                        const searchLimiterPos = searchLimiter.getBoundingClientRect().bottom;
        
                        if (searchLimiterPos <= 80) {
                            $scope.isSearchVisible = true;  // Show search bar on scroll
                        } else {
                            $scope.isSearchVisible = false;  // Hide search bar when not scrolled
                        }
                        $scope.$apply();  // Update the view
                    }
                });
            } else {
                $scope.isSearchVisible = true;  // Always show search on other pages
            }
        };
        
        // Updating the nav-item for resonsive
        $scope.updateNav = function(mediaQuery) {
            const navItems = $document[0].querySelectorAll('.nav-item');
            navItems.forEach(item => {
                const navLink = item.querySelector('.nav-link');
                if (mediaQuery.matches) {
                    if (navLink.innerHTML.includes('fa-cart-shopping')) {
                        navLink.innerHTML = 'Cart';
                    } else if (navLink.innerHTML.includes('fa-heart')) {
                        navLink.innerHTML = 'Wishlist';
                    } else if (navLink.innerHTML.includes('fa-gear')) {
                        navLink.innerHTML = 'Settings';
                    } else if (navLink.innerHTML.includes('fa-scroll')) {
                        navLink.innerHTML = 'History';
                    }
                } else {
                    if (navLink.textContent === 'Cart') {
                        navLink.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>';
                    } else if (navLink.textContent === 'Wishlist') {
                        navLink.innerHTML = '<i class="fa-regular fa-heart"></i>';
                    } else if (navLink.textContent === 'Settings') {
                        navLink.innerHTML = '<i class="fa-solid fa-gear"></i>';
                    } else if (navLink.textContent === 'History') {
                        navLink.innerHTML = '<i class="fa-solid fa-scroll"></i>';
                    }
                }
            });
        };

        
        $rootScope.$on('$routeChangeStart', function() {
            $scope.handleScrollBehavior(); 
        });
        
        $scope.handleScrollBehavior(); 
        $scope.initDarkMode();
        $scope.initSearchBox();
        $scope.initResponsiveMenu();
    }]);