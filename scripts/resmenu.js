// Menunggu hingga seluruh konten DOM dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item'); // Mengambil semua elemen navigasi
    const navbar = document.querySelector('.navbar'); // Mengambil elemen navbar

    /**
     * Memperbarui tampilan ikon dan teks pada item navigasi 
     * berdasarkan lebar layar perangkat.
     * @param {MediaQueryList} e - Objek yang berisi informasi tentang media query.
     */
    function updateNav(e) {
        navItems.forEach(item => {
            const navLink = item.querySelector('.nav-link'); // Mengambil elemen link navigasi

            if (e.matches) {
                // Mengganti ikon dengan teks untuk tampilan mobile
                if (navLink.innerHTML.includes('fa-cart-shopping')) {
                    navLink.innerHTML = 'Cart'; // Mengganti ikon keranjang dengan teks 'Cart'
                } else if (navLink.innerHTML.includes('fa-heart')) {
                    navLink.innerHTML = 'Wishlist'; // Mengganti ikon wishlist dengan teks 'Wishlist'
                } else if (navLink.innerHTML.includes('fa-angle-down')) {
                    navLink.innerHTML = 'Explore'; // Mengganti ikon 'Explore' dengan teks 'Explore'
                }
            } else {
                // Mengembalikan ikon untuk tampilan desktop
                if (navLink.textContent === 'Cart') {
                    navLink.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>'; // Mengembalikan ikon keranjang
                } else if (navLink.textContent === 'Wishlist') {
                    navLink.innerHTML = '<i class="fa-regular fa-heart"></i>'; // Mengembalikan ikon wishlist
                } else if (navLink.textContent === 'Explore') {
                    navLink.innerHTML = 'Explore <i class="fa-solid fa-angle-down"></i>'; // Mengembalikan ikon 'Explore'
                }
            }
        });
    }

    const mediaQuery = window.matchMedia('(max-width: 768px)'); // Mendefinisikan media query untuk lebar maksimum 768px
    mediaQuery.addEventListener('change', updateNav); // Menambahkan pendengar perubahan untuk media query
    updateNav(mediaQuery); // Memanggil fungsi updateNav untuk pertama kali
});
