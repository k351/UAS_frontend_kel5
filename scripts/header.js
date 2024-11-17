// Mendapatkan elemen menu dan konten yang terkait dengan "Explore", pria, dan wanita
const exploreMenu = document.getElementById("Explore");
const exploreLinks = document.querySelector(".explore-links");
const priaMenu = document.querySelector(".pria");
const wanitaMenu = document.querySelector(".wanita");
const priaExplore = document.getElementById("pria-contents");
const wanitaExplore = document.getElementById("wanita-contents");
const searchInput = document.querySelector('.search-header input');
const blackBox = document.querySelector('.black-box');

// Menunggu sampai seluruh konten halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {

    // Event listener untuk menampilkan konten pria saat klik menu pria
    priaMenu.addEventListener("click", () => {
        // Toggle untuk menampilkan atau menyembunyikan konten pria
        priaExplore.classList.toggle("contents-show"); 
        // Menyembunyikan konten wanita
        wanitaExplore.classList.remove("contents-show"); 
        // Memperbarui posisi elemen Explore
        updateExplore(); 
    });
    
    // Event listener untuk menampilkan konten wanita saat klik menu wanita
    wanitaMenu.addEventListener("click", () => {
        // Toggle untuk menampilkan atau menyembunyikan konten wanita
        wanitaExplore.classList.toggle("contents-show"); 
        // Menyembunyikan konten pria
        priaExplore.classList.remove("contents-show"); 
        // Memperbarui posisi elemen Explore
        updateExplore(); 
    });
    
    // Event listener untuk tombol Explore untuk menampilkan daftar link
    exploreMenu.addEventListener("click", () => {
        // Menampilkan atau menyembunyikan link Explore
        exploreLinks.classList.toggle("explore-links-show"); 
        // Menyembunyikan konten wanita dan pria
        wanitaExplore.classList.remove("contents-show"); 
        priaExplore.classList.remove("contents-show"); 
        // Memperbarui posisi elemen Explore
        updateExplore(); 
    });
    
    // Mengecek apakah halaman saat ini adalah "index.html" atau halaman utama
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('index.html') || currentPage === '/') {
        // Bagian ini hanya berjalan pada halaman index.html (halaman utama)
        window.addEventListener('scroll', () => {
            // Mendapatkan elemen pembatas untuk tampilan pencarian dan kategori
            const searchLimiter = document.querySelector('.home');
            const searchHidden = document.querySelector('.search-header');
            const categoriesLimiter = document.querySelector('.categories');
            const categoriesHidden = document.querySelector('.categories-header');
            const searchLimiterPos = searchLimiter.getBoundingClientRect().bottom;
            const categoriesLimiterPos = categoriesLimiter.getBoundingClientRect().bottom;
    
            // Menampilkan elemen pencarian jika posisi pembatas sudah melewati 80px
            if (searchLimiterPos <= 80) {
                searchHidden.classList.add('search-header-show');
            } else {
                searchHidden.classList.remove('search-header-show');
            }
    
            // Menampilkan header kategori saat posisi pembatas kategori melewati 80px
            if (categoriesLimiterPos <= 80) {
                categoriesHidden.classList.add('categories-header-show');
            } else {
                categoriesHidden.classList.remove('categories-header-show');
            }
        });
    } else {
        // Menampilkan elemen pencarian secara otomatis pada halaman shop.html tanpa harus menggulir
        const searchHidden = document.querySelector('.search-header');
        searchHidden.classList.add('search-header-show');
    }
    
    // Event listener saat fokus pada input pencarian, menampilkan kotak hitam di latar belakang
    searchInput.addEventListener('focus', () => {
        blackBox.classList.add('black-box-show');
    });
    
    // Event listener saat input pencarian tidak fokus lagi, menyembunyikan kotak hitam
    searchInput.addEventListener('blur', () => {
        blackBox.classList.remove('black-box-show');
    });
});

// Fungsi untuk memperbarui posisi elemen Explore berdasarkan ukuran layar
function updateExplore() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches; // Mengecek apakah layar berukuran mobile
    if (isMobile) {
        // Jika layar mobile, atur posisi elemen ke kanan
        exploreLinks.style.right = '3%';
        priaExplore.style.right = '3%';
        wanitaExplore.style.right = '3%';
        exploreLinks.style.left = '';  
        priaExplore.style.left = '';   
        wanitaExplore.style.left = ''; 
    } else {
        // Jika layar lebih besar, atur posisi elemen berdasarkan posisi tombol Explore
        const rect = exploreMenu.getBoundingClientRect();
        exploreLinks.style.left = `${rect.left}px`;
        priaExplore.style.left = `${rect.left - 410}px`; 
        wanitaExplore.style.left = `${rect.left - 410}px`; 
        exploreLinks.style.right = '';  
        priaExplore.style.right = '';   
        wanitaExplore.style.right = ''; 
    }
}

// Menambahkan event listener untuk memperbarui posisi elemen saat ukuran layar berubah
window.addEventListener('resize', updateExplore);

// Menambahkan event listener untuk memperbarui posisi saat mode fullscreen berubah
document.addEventListener('fullscreenchange', updateExplore);

// Memanggil updateExplore saat halaman pertama kali dimuat
updateExplore();
