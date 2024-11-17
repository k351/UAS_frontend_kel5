import productsData from './productsData.js';
import { addToWishlist, loadIconStates } from './addToWishlist.js';

document.addEventListener("DOMContentLoaded", function() {
    // Inisiasi variabel untuk elemen-elemen DOM dan data produk
    const productImage = document.querySelector(".product-image"),
          productData = JSON.parse(document.getElementById('productData').textContent),
          product = productsData.find(item => item.name === productData.name),
    // Mengambil wishlist menggunakan loadIconStates()
          iconStates = loadIconStates(),
          isInWishlist = iconStates[product.name] || false;

    // Membuat tombol wishlist
    const wishlistButton = document.createElement('button');
    wishlistButton.classList.add('wishlist-btn');
    wishlistButton.setAttribute('aria-label', isInWishlist ? 'Remove from wishlist' : 'Add to wishlist');
    wishlistButton.innerHTML = `<i class="${isInWishlist ? 'fa-solid' : 'fa-regular'} fa-heart"
                                 style="color: ${isInWishlist ? 'var(--secondary-color)' : 'gray'};"></i>`;
    
    productImage.appendChild(wishlistButton);

    // Event listener untuk menambah atau menghapus dari wishlist
    wishlistButton.addEventListener('click', function() {
        addToWishlist(product.name, product.image, product.price, product.sold, product.stars, wishlistButton);
    });
});
