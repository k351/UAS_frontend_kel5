import productsData from './productsData.js';
import { addToWishlist, loadIconStates } from './addToWishlist.js';

let currentSortOrder = 'asc'; // Urutan penyortiran default

// Fungsi untuk menyortir item berdasarkan kriteria yang dipilih
function sortWishlistItems(items, criteria, order = 'asc') {
    let sortedItems = [...items]; // Salin array items
    if (criteria === 'price') {
        return sortedItems.sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/[^\d]/g, '')); 
            const priceB = parseFloat(b.price.replace(/[^\d]/g, '')); 
            return order === 'asc' ? priceA - priceB : priceB - priceA; // Bandingkan berdasarkan urutan
        });
    } else if (criteria === 'rating') {
        return sortedItems.sort((a, b) => b.stars - a.stars); // Urutkan berdasarkan rating
    } else if (criteria === 'name') {
        return sortedItems.sort((a, b) => {
            let nameA = a.name.toLowerCase(); 
            let nameB = b.name.toLowerCase(); 
            return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA); // Urutkan berdasarkan nama
        });
    }

    return sortedItems; // Kembalikan item yang telah disortir
}

// Fungsi untuk memuat item wishlist dari localStorage dan menampilkannya
function loadWishlistItems(sortCriteria = null, sortOrder = 'asc') {
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || []; // Ambil item wishlist
    const wishlistContainer = document.getElementById('wishlist-container');
    
    wishlistContainer.innerHTML = ''; 
    
    // Memuat status ikon yang disimpan
    const iconStates = loadIconStates();
    
    if (wishlistItems.length > 0) { // Cek apakah wishlist tidak kosong
        // Terapkan penyortiran jika kriteria dipilih
        let sortedItems = wishlistItems;
        if (sortCriteria) {
            sortedItems = sortWishlistItems(wishlistItems, sortCriteria, sortOrder); // Urutkan item
        }

        // Render setiap produk di wishlist
        sortedItems.forEach(product => {
            const isInWishlist = iconStates[product.name] || false; // Cek status wishlist
            let productBox = `
                <div class="product-card fade-in">
                    <div class="image-container">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <h4 class="product-price">${product.price}</h4>
                        <p class="product-sold">Terjual ${product.sold}</p>
                        <div class="rating">
                            ${'<i class="fa fa-star"></i>'.repeat(product.stars)} ${product.stars}.0
                        </div>
                    </div>
                    <button class="wishlist-btn" data-product-name="${product.name}">
                        <i class="${isInWishlist ? 'fa-solid' : 'fa-regular'} fa-heart"
                       style="color: ${isInWishlist ? 'var(--secondary-color)' : 'gray'};"></i>
                    </button>
                    <button class="add-cart" onclick="addToCart('${product.name}', '${product.image}', '${product.price}')">+ Keranjang</button>
                </div>
            `;
            wishlistContainer.innerHTML += productBox; // Tambahkan kotak produk ke kontainer
        });

        attachWishlistEventListeners(); // Lampirkan pendengar peristiwa pada tombol wishlist
    } else {
        wishlistContainer.innerHTML = '<p style="color: var(--tertiary-color);">Your wishlist is empty!</p>'; // Tampilkan pesan jika wishlist kosong
    }
}

// Fungsi untuk menangani pemilihan kriteria penyortiran
document.querySelectorAll('input[name="sort"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const sortValue = this.value; // Ambil nilai dari radio yang dipilih

        let sortCriteria = null;
        let sortOrder = 'asc';

        if (sortValue === 'price') {
            sortCriteria = 'price'; // Kriteria penyortiran berdasarkan harga
            sortOrder = currentSortOrder; // Pertahankan urutan saat ini
        } else if (sortValue === 'rating') {
            sortCriteria = 'rating'; // Kriteria penyortiran berdasarkan rating
        } else if (sortValue === 'name-asc') {
            sortCriteria = 'name'; // Kriteria penyortiran berdasarkan nama, urutan naik
            sortOrder = 'asc';
        } else if (sortValue === 'name-desc') {
            sortCriteria = 'name'; // Kriteria penyortiran berdasarkan nama, urutan turun
            sortOrder = 'desc';
        }

        loadWishlistItems(sortCriteria, sortOrder); // Muat wishlist dengan kriteria dan urutan yang dipilih
    });
});

// Tangani penyortiran berdasarkan harga dan arah panah toggle
document.getElementById('priceArrow').addEventListener('click', function() {
    const priceArrow = document.getElementById('priceArrow');

    // Ubah urutan penyortiran antara naik dan turun
    if (currentSortOrder === 'asc') {
        currentSortOrder = 'desc'; 
        priceArrow.classList.remove('fa-arrow-up'); 
        priceArrow.classList.add('fa-arrow-down'); 
    } else {
        currentSortOrder = 'asc'; 
        priceArrow.classList.remove('fa-arrow-down'); 
        priceArrow.classList.add('fa-arrow-up'); 
    }

    loadWishlistItems('price', currentSortOrder); // Muat ulang dengan urutan penyortiran baru
});

// Fungsi untuk melampirkan pendengar peristiwa pada tombol wishlist
function attachWishlistEventListeners() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.getAttribute('data-product-name'); // Ambil nama produk dari atribut
            const product = productsData.find(item => item.name === productName); // Temukan produk berdasarkan nama

            // Panggil addToWishlist dan kirim elemen tombol untuk pembaruan CSS
            addToWishlist(product.name, product.image, product.price, product.sold, product.stars, this);
            loadWishlistItems(); // Muat ulang item wishlist
        });
    });
}

// Muat item wishlist saat halaman dimuat, tanpa penyortiran diterapkan
window.onload = () => loadWishlistItems(); // Panggil fungsi untuk memuat item wishlist
