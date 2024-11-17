import productsData from './productsData.js';
import { loadIconStates } from './addToWishlist.js';
import { attachWishlistEventListeners } from './indexproduct.js';

// Variabel untuk pagination
let paginationCurrentPage = 1;
const paginationItemsPerPage = 4;
let filteredProducts = productsData; // Awalnya menampilkan semua produk

// Fungsi untuk merender produk dengan pagination
function renderProducts(page) {
    const startIndex = (page - 1) * paginationItemsPerPage; // Indeks awal
    const endIndex = startIndex + paginationItemsPerPage; // Indeks akhir
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex); // Produk yang dipaginasikan

    let productContainer = document.querySelector('.box-container');
    productContainer.innerHTML = '';  // Kosongkan kontainer

    // Memuat status ikon yang disimpan
    const iconStates = loadIconStates();

    paginatedProducts.forEach(product => {
        const isInWishlist = iconStates[product.name] || false; // Cek apakah produk ada di wishlist

        let productBox = `
            <div class="box">
                <a href="product_${product.index}.html">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="desc">
                        <span>${product.category}</span>
                        <h5>${product.name}</h5>
                        <div class="star">
                            ${'<i class="fa-solid fa-star"></i>'.repeat(product.stars)} <!-- Tampilkan bintang -->
                        </div>
                        <h4>${product.price}</h4>
                    </div>
                    <a onclick="addToCart('${product.name}', '${product.image}', '${product.price}')">
                        <i class="fa-solid fa-cart-plus cart" style="color: ${product.cart_icon_color};"></i>
                    </a>
                    <button class="wishlist-btn" data-product-name="${product.name}">
                        <i class="${isInWishlist ? 'fa-solid' : 'fa-regular'} fa-heart"
                        style="color: ${isInWishlist ? 'var(--secondary-color)' : 'gray'};"></i>
                    </button>
                </a>
            </div>
        `;
        productContainer.innerHTML += productBox; // Tambahkan kotak produk ke kontainer
    });

    attachWishlistEventListeners(); // Lampirkan pendengar peristiwa untuk wishlist
}

// Fungsi untuk membuat tombol pagination secara dinamis
function setupPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Kosongkan kontainer pagination

    const totalPages = Math.ceil(filteredProducts.length / paginationItemsPerPage); // Hitung total halaman

    // Buat tombol angka
    for (let i = 1; i <= totalPages; i++) {
        let pageLink = document.createElement('a');
        pageLink.innerText = i; // Nomor halaman
        if (i === paginationCurrentPage) {
            pageLink.classList.add('active'); // Tandai halaman aktif
        }
        pageLink.href = '#';
        pageLink.onclick = () => changePage(i); // Ganti halaman saat diklik
        paginationContainer.appendChild(pageLink); // Tambahkan tautan ke kontainer
    }

    // Tombol panah kanan (navigasi maju)
    if (paginationCurrentPage < totalPages) {
        const navButtonNext = document.createElement('a');
        navButtonNext.href = '#';
        navButtonNext.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        navButtonNext.classList.add('pagination-nav');
        navButtonNext.onclick = () => changePage(paginationCurrentPage + 1); // Navigasi ke halaman berikutnya
        paginationContainer.appendChild(navButtonNext);
    }

    // Tombol panah kiri (navigasi mundur)
    if (paginationCurrentPage > 1) {
        const navButtonPrev = document.createElement('a');
        navButtonPrev.href = '#';
        navButtonPrev.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
        navButtonPrev.classList.add('pagination-nav');
        navButtonPrev.onclick = () => changePage(paginationCurrentPage - 1); // Navigasi ke halaman sebelumnya
        paginationContainer.appendChild(navButtonPrev);
    }
}

// Fungsi untuk mengubah halaman dan merender ulang produk
function changePage(page) {
    paginationCurrentPage = page; // Perbarui halaman saat ini
    renderProducts(paginationCurrentPage); // Render produk
    setupPagination(); 
}

// Fungsi untuk menangani fungsi pencarian
function search() {
    let filter = document.getElementById('searchBar').value.toUpperCase(); // Ambil nilai pencarian
    filteredProducts = productsData.filter(product => product.name.toUpperCase().includes(filter)); // Filter produk

    paginationCurrentPage = 1; // Reset ke halaman pertama
    
    renderProducts(paginationCurrentPage); // Render halaman pertama dari hasil pencarian
    setupPagination(); 
}

// Fungsi untuk memfilter berdasarkan kategori
function filterByCategory() {
    const selectedCategory = document.getElementById('categories').value.toUpperCase(); // Ambil kategori yang dipilih

    if (selectedCategory === "none") {
        filteredProducts = productsData; // Tampilkan semua produk jika tidak ada kategori yang dipilih
    } else {
        filteredProducts = productsData.filter(product => product.category.toUpperCase() === selectedCategory); // Filter produk berdasarkan kategori
    }
    paginationCurrentPage = 1; // Reset ke halaman pertama

    renderProducts(paginationCurrentPage); // Render halaman pertama dari hasil filter
    setupPagination(); 
}

// Lampirkan pendengar peristiwa untuk kolom pencarian
document.getElementById('searchBar').addEventListener('input', search); // Pencarian
document.getElementById('categories').addEventListener('change', filterByCategory); // Filter kategori

// Memuat awal
window.onload = function() {
    // Mengambil query pencarian dan filter dari LocalStorage
    const searchQuery = localStorage.getItem('searchQuery');
    const filterQuery = localStorage.getItem('filterQuery');

    if (searchQuery && searchQuery !== '') {
        document.getElementById('searchBar').value = searchQuery; // Isi kolom pencarian
        search(); // Jalankan fungsi pencarian
        localStorage.setItem('searchQuery', ''); // Hapus query pencarian
    } else if (filterQuery && filterQuery !== 'none') {
        document.getElementById('categories').value = filterQuery; // Set kategori
        filterByCategory(); // Jalankan fungsi filter
        localStorage.setItem('filterQuery', 'none'); // Hapus query filter
    } else {
        filteredProducts = productsData; // Reset produk yang difilter ke semua produk
        renderProducts(paginationCurrentPage); // Render semua produk
    }

    setupPagination(); 
};