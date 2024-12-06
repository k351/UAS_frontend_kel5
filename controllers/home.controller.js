angular.module('revifeApp').controller('HomeController', ['$scope', '$timeout', '$window', '$http', '$rootScope',
    function ($scope, $timeout, $window, $http, $rootScope) {
        //Initiate variabel
        $scope.currentIndex = 0;
        $scope.categories = [];
        let autoSlideInterval; 
        const slideDuration = 700;
        const autoSlideDelay = 4000; 
        let totalSlides = 0;
        let slideWidth = 0;

         // Updates the width of each slide based on container size
        $scope.updateSlideWidth = function () {
            return angular.element('.carousel-container').outerWidth();
        };

        // Moves to the next slide, resets position if it's the last slide
        $scope.moveToNextSlide = function () {
            slideWidth = $scope.updateSlideWidth();
            $scope.currentIndex++;

             // Reset to the first slide when reaching the end
            angular.element('.carousel-track').css({
                'transition': `transform ${slideDuration}ms ease`,
                'transform': `translateX(-${$scope.currentIndex * slideWidth}px)`
            });

            if ($scope.currentIndex === totalSlides) {
                $timeout(() => {
                    angular.element('.carousel-track').css('transition', 'none');
                    $scope.currentIndex = 0;
                    angular.element('.carousel-track').css('transform', 'translateX(0)');
                }, slideDuration);
            }
        };
         // Moves to the previous slide, prevents going before the first slide
        $scope.moveToPrevSlide = function () {
            slideWidth = $scope.updateSlideWidth();
            if ($scope.currentIndex > 0) {
                $scope.currentIndex--;
                angular.element('.carousel-track').css({
                    'transition': `transform ${slideDuration}ms ease`,
                    'transform': `translateX(-${$scope.currentIndex * slideWidth}px)`
                });
            }
        };
        // Starts the auto-slide feature with the specified delay
        $scope.startAutoSlide = function () {
            autoSlideInterval = $timeout(() => {
                $scope.moveToNextSlide();
                $scope.startAutoSlide();
            }, autoSlideDelay);
        };
         // Stops the auto-slide feature
        $scope.stopAutoSlide = function () {
            if (autoSlideInterval) {
                $timeout.cancel(autoSlideInterval);
            }
        };

        // Initialize carousel
        $scope.initCarousel = function () {
            const $slides = angular.element('.slide');
            totalSlides = $slides.length;

            // Clone the first slide for seamless looping
            const $firstSlideClone = $slides.first().clone();
            angular.element('.carousel-track').append($firstSlideClone);

            slideWidth = $scope.updateSlideWidth();

            $scope.startAutoSlide();

            angular.element($window).on('resize', function () {
                $scope.$apply(() => {
                    slideWidth = $scope.updateSlideWidth();
                    angular.element('.carousel-track').css('transform', `translateX(-${$scope.currentIndex * slideWidth}px)`);
                });
            });
        };
         // Cleanup when the controller is destroyed
        $scope.$on('$destroy', function () {
            $scope.stopAutoSlide();
            angular.element($window).off('resize');
        });
        // Fetches the categories to display on the home page
        $scope.loadCategories = function () {
            $http.get('/api/categories/home').then(function(response) {
                $scope.categories = response.data;
            }).catch(function(error) {
                console.error('Error fetching categories:', error);
            });
        };
         // Handles the home page search and redirects to the shop page
        $scope.handleHomeSearch = function(searchQuery) {
            $rootScope.searchQuery = searchQuery; 
            $window.location.href = '#!/shop';
        };
         // Filters products by category and redirects to the shop page
        $scope.handleCategoryFilter = function(category) {
            $rootScope.selectedCategory = category; 
            $window.location.href = '#!/shop';
        };
        // Load categories and initialize carousel on page load
        $scope.loadCategories();
        $timeout(() => {
            $scope.initCarousel();
        });
    }
]);
