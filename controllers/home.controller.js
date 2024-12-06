angular.module('revifeApp').controller('HomeController', ['$scope', '$timeout', '$window', '$http',
    function ($scope, $timeout, $window, $http) {
        $scope.currentIndex = 0;
        $scope.categories = [];
        let autoSlideInterval; 
        const slideDuration = 700;
        const autoSlideDelay = 4000; 
        let totalSlides = 0;
        let slideWidth = 0;

        $scope.updateSlideWidth = function () {
            return angular.element('.carousel-container').outerWidth();
        };

        $scope.moveToNextSlide = function () {
            slideWidth = $scope.updateSlideWidth();
            $scope.currentIndex++;

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

        $scope.startAutoSlide = function () {
            autoSlideInterval = $timeout(() => {
                $scope.moveToNextSlide();
                $scope.startAutoSlide();
            }, autoSlideDelay);
        };

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

        $scope.$on('$destroy', function () {
            $scope.stopAutoSlide();
            angular.element($window).off('resize');
        });

        $scope.loadCategories = function () {
            $http.get('/api/categories/home').then(function(response) {
                $scope.categories = response.data;
            }).catch(function(error) {
                console.error('Error fetching categories:', error);
            });
        };

        $scope.loadCategories();
        $timeout(() => {
            $scope.initCarousel();
        });
    }
]);
