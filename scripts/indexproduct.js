// Mengimpor data produk dari file productsData.js
import productsData from './productsData.js';
// Mengimpor fungsi untuk menambahkan produk ke wishlist dan memuat status ikon dari file addToWishlist.js
import { addToWishlist, loadIconStates } from './addToWishlist.js';

/**
 * Mengarahkan pengguna ke halaman produk berdasarkan indeks yang diberikan.
 * @param {number} index - Indeks produk yang akan ditampilkan.
 */
function redirectToProductPage(index) {
    window.location.href = `product_${index}.html`; 
}

/**
 * Fungsi untuk merender semua produk ke dalam kontainer.
 * Tidak menggunakan paginasi, sehingga semua produk akan ditampilkan sekaligus.
 */
function renderProducts() {
    const productContainer = document.querySelector('.box-container');
    productContainer.innerHTML = '';  // Membersihkan kontainer sebelum merender ulang

    // Memuat status ikon wishlist yang telah disimpan
    const iconStates = loadIconStates();

    productsData.forEach(product => {
        const isInWishlist = iconStates[product.name] || false; // Memeriksa apakah produk ada dalam wishlist

        // Membuat elemen produk
        let productBox = `
            <div class="box">
                <a onclick="redirectToProductPage(${product.index})">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="desc">
                        <span>${product.category}</span>
                        <h5>${product.name}</h5>
                        <div class="star">
                            ${'<i class="fa-solid fa-star"></i>'.repeat(product.stars)} <!-- Menampilkan bintang rating -->
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
        productContainer.innerHTML += productBox; // Menambahkan elemen produk ke dalam kontainer
    });

    attachWishlistEventListeners();  // Melampirkan pendengar acara untuk tombol wishlist
}

/**
 * Melampirkan pendengar acara klik untuk semua tombol wishlist.
 * Ketika tombol di klik, produk akan ditambahkan atau dihapus dari wishlist.
 */
function attachWishlistEventListeners() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn'); 2
    wishlistButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.getAttribute('data-product-name'); // Mengambil nama produk dari atribut
            const product = productsData.find(item => item.name === productName);  // Mencari produk berdasarkan nama

            // Memanggil fungsi addToWishlist dan meneruskan elemen tombol untuk pembaruan CSS
            addToWishlist(product.name, product.image, product.price, product.sold, product.stars, this);
        });
    });
}

// Inisialisasi pemuatan saat jendela sudah siap
window.onload = function() {
    renderProducts();  // Merender produk saat halaman dimuat
};

// Mengekspos fungsi redirectToProductPage untuk digunakan di luar modul
window.redirectToProductPage = redirectToProductPage;
export { attachWishlistEventListeners };