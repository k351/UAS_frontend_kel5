angular.module('revifeApp').controller('HomeController', ['$scope', '$timeout', '$window',
    function ($scope, $timeout, $window) {
        $scope.currentIndex = 0;
        let autoSlideInterval; 
        const slideDuration = 700;
        const autoSlideDelay = 5000; 
        let totalSlides = 0;
        let slideWidth = 0;

        function updateSlideWidth() {
            return angular.element('.carousel-container').outerWidth();
        }

        $scope.moveToNextSlide = function () {
            slideWidth = updateSlideWidth();
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
            slideWidth = updateSlideWidth();
            if ($scope.currentIndex > 0) {
                $scope.currentIndex--;
                angular.element('.carousel-track').css({
                    'transition': `transform ${slideDuration}ms ease`,
                    'transform': `translateX(-${$scope.currentIndex * slideWidth}px)`
                });
            }
        };

        function startAutoSlide() {
            autoSlideInterval = $timeout(() => {
                $scope.moveToNextSlide();
                startAutoSlide();
            }, autoSlideDelay);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                $timeout.cancel(autoSlideInterval);
            }
        }

        // Initialize carousel
        $scope.initCarousel = function () {
            const $slides = angular.element('.slide');
            totalSlides = $slides.length;

            // Clone the first slide for seamless looping
            const $firstSlideClone = $slides.first().clone();
            angular.element('.carousel-track').append($firstSlideClone);

            slideWidth = updateSlideWidth();

            startAutoSlide();

            angular.element($window).on('resize', function () {
                slideWidth = updateSlideWidth();
                angular.element('.carousel-track').css('transform', `translateX(-${$scope.currentIndex * slideWidth}px)`);
            });
        };

        $scope.$on('$destroy', function () {
            stopAutoSlide();
            angular.element($window).off('resize');
        });

        $timeout($scope.initCarousel);
    }
]);
