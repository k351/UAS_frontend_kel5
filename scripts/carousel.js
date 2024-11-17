$(document).ready(function() {
    let currentIndex = 0; // Indeks slide saat ini
    const $slides = $('.slide'); // Mengambil semua elemen slide
    const totalSlides = $slides.length; // Total jumlah slide
    const $carouselTrack = $('.carousel-track'); // Elemen track carousel
    const $carouselContainer = $('.carousel-container'); // Elemen kontainer carousel

    // Mengkloning slide pertama dan menambahkannya ke akhir untuk looping yang mulus
    const $firstSlideClone = $slides.first().clone();
    $carouselTrack.append($firstSlideClone);

    // Mengatur keadaan awal
    let autoSlideInterval; // Interval untuk auto-slide
    const slideDuration = 700; // Durasi transisi slide dalam milidetik
    const autoSlideDelay = 5000; // Waktu tunda auto-slide dalam milidetik

    // Fungsi untuk memperbarui lebar slide secara dinamis
    function updateSlideWidth() {
        return $carouselContainer.outerWidth(); // Mengembalikan lebar kontainer carousel
    }

    // Fungsi untuk berpindah ke slide berikutnya
    function moveToNextSlide() {
        const slideWidth = updateSlideWidth(); 
        currentIndex++;

        $carouselTrack.css({
            'transition': `transform ${slideDuration}ms ease`, 
            'transform': `translateX(-${currentIndex * slideWidth}px)` 
        });

        // Jika mencapai slide terakhir, reset ke slide pertama
        if (currentIndex === totalSlides) {
            setTimeout(function() {
                $carouselTrack.css('transition', 'none'); 
                currentIndex = 0;
                $carouselTrack.css('transform', `translateX(0)`); // Reset ke slide pertama
            }, slideDuration);
        }
    }

    // Memulai auto-slide setiap 5 detik
    function startAutoSlide() {
        autoSlideInterval = setInterval(moveToNextSlide, autoSlideDelay);
    }

    // Menghentikan auto-slide
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    startAutoSlide(); 32

    // Fungsi untuk berpindah ke slide sebelumnya
    function moveToPrevSlide() {
        const slideWidth = updateSlideWidth(); 
        if (currentIndex > 0) { // Memastikan tidak bergerak ke slide negatif
            currentIndex--; 
            $carouselTrack.css({
                'transition': `transform ${slideDuration}ms ease`, 
                'transform': `translateX(-${currentIndex * slideWidth}px)` 
            });
        }
    }

    // Event handler untuk tombol panah kanan
    $('.right-arrow').click(function() {
        stopAutoSlide();  
        moveToNextSlide(); 
        startAutoSlide(); 
    });

    // Event handler untuk tombol panah kiri
    $('.left-arrow').click(function() {
        stopAutoSlide(); 
        moveToPrevSlide(); 
        startAutoSlide(); 
    });

    // Menangani pengubahan ukuran jendela dan menghitung ulang lebar secara dinamis
    $(window).resize(function() {
        const slideWidth = updateSlideWidth(); 
        $carouselTrack.css('transform', `translateX(-${currentIndex * slideWidth}px)`);
    });
});
