const app = angular.module('revifeApp', []);

app.controller('HeaderController', ['$scope', '$window', '$document', function($scope, $window, $document) {
    // Dark Mode functionality
    $scope.initDarkMode = function() {
        $scope.darkTheme = $document[0].getElementById("dark-theme");
        
        // Check localStorage theme
        if($window.localStorage.getItem("theme") === "dark") {
            $document[0].body.classList.add("darkmode");
            $scope.darkTheme.src = "../images/icon/sun.png";
        } else {
            $scope.darkTheme.src = "../images/icon/moon.png";
        }
    };

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
    $scope.initExplore = function() {
        $scope.exploreMenu = $document[0].getElementById("Explore");
        $scope.exploreLinks = $document[0].querySelector(".explore-links");
        $scope.priaMenu = $document[0].querySelector(".pria");
        $scope.wanitaMenu = $document[0].querySelector(".wanita");
        $scope.priaExplore = $document[0].getElementById("pria-contents");
        $scope.wanitaExplore = $document[0].getElementById("wanita-contents");
        $scope.blackBox = $document[0].querySelector(".black-box");

        // Update explore position on window resize
        angular.element($window).on('resize', function() {
            $scope.updateExplore();
        });

        // Initial position update
        $scope.updateExplore();
    };

    $scope.toggleExplore = function() {
        $scope.exploreLinks.classList.toggle("explore-links-show");
        $scope.wanitaExplore.classList.remove("contents-show");
        $scope.priaExplore.classList.remove("contents-show");
        $scope.blackBox.classList.toggle("black-box-show");
        $scope.updateExplore();
    };

    $scope.showPriaContent = function() {
        $scope.priaExplore.classList.toggle("contents-show");
        $scope.wanitaExplore.classList.remove("contents-show");
        $scope.updateExplore();
    };

    $scope.showWanitaContent = function() {
        $scope.wanitaExplore.classList.toggle("contents-show");
        $scope.priaExplore.classList.remove("contents-show");
        $scope.updateExplore();
    };

    $scope.updateExplore = function() {
        const isMobile = $window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            $scope.exploreLinks.style.right = '3%';
            $scope.priaExplore.style.right = '3%';
            $scope.wanitaExplore.style.right = '3%';
            $scope.exploreLinks.style.left = '';
            $scope.priaExplore.style.left = '';
            $scope.wanitaExplore.style.left = '';
        } else {
            const rect = $scope.exploreMenu.getBoundingClientRect();
            $scope.exploreLinks.style.left = `${rect.left}px`;
            $scope.priaExplore.style.left = `${rect.left - 410}px`;
            $scope.wanitaExplore.style.left = `${rect.left - 410}px`;
            $scope.exploreLinks.style.right = '';
            $scope.priaExplore.style.right = '';
            $scope.wanitaExplore.style.right = '';
        }
    };

    // Search functionality
    $scope.handleHeaderSearch = function(event) {
        event.preventDefault();
        const searchQuery = $document[0].getElementById('headerSearchBar').value;
        
        if (searchQuery === '') {
            alert('You searched for nothing!');
            return;
        }
        
        $window.localStorage.setItem('searchQuery', searchQuery);
        $window.location.href = 'shop.html';
    };

    $scope.handleHomeSearch = function(event) {
        event.preventDefault();
        const searchQuery = $document[0].getElementById('homeSearchBar').value;
        
        if (searchQuery === '') {
            alert('You searched for nothing!');
            return;
        }
        
        $window.localStorage.setItem('searchQuery', searchQuery);
        $window.location.href = 'shop.html';
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

    $scope.updateNav = function(mediaQuery) {
        const navItems = $document[0].querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const navLink = item.querySelector('.nav-link');
            if (mediaQuery.matches) {
                if (navLink.innerHTML.includes('fa-cart-shopping')) {
                    navLink.innerHTML = 'Cart';
                } else if (navLink.innerHTML.includes('fa-heart')) {
                    navLink.innerHTML = 'Wishlist';
                } else if (navLink.innerHTML.includes('fa-angle-down')) {
                    navLink.innerHTML = 'Explore';
                }
            } else {
                if (navLink.textContent === 'Cart') {
                    navLink.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>';
                } else if (navLink.textContent === 'Wishlist') {
                    navLink.innerHTML = '<i class="fa-regular fa-heart"></i>';
                } else if (navLink.textContent === 'Explore') {
                    navLink.innerHTML = 'Explore <i class="fa-solid fa-angle-down"></i>';
                }
            }
        });
    };

    // Initialize everything
    $scope.init = function() {
        $scope.initDarkMode();
        $scope.initExplore();
        $scope.initResponsiveMenu();
    };
}]);